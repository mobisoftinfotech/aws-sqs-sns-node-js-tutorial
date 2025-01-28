/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteMessageCommand, Message, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'sqs-consumer';
import { SqsMessageDao } from './daos/sqs-message.dao';
import { SqsMessage } from './models/sqs-message';
import { MessageSourceType } from './utils/constants';

@Injectable()
export class SqsConsumerService implements OnModuleInit, OnModuleDestroy {
  private sqsClient: SQSClient;
  private queueUrl: string;
  private consumer: Consumer;

  constructor(
    private configService: ConfigService,
    private sqsMessageDao: SqsMessageDao,
  ) {
    this.sqsClient = new SQSClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.queueUrl = this.configService.get('SQS_QUEUE_URL');
  }

  async deleteConsumedMessage(receiptHandle: string) {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      const response = await this.sqsClient.send(command);
      return response;
    } catch (error) {
      console.log('Delete message error', error);
    }
  }

  public async onModuleInit(): Promise<void> {
    this.pollMessages();
  }

  private formatSQSMessage(message: Message) {
    const messageBody = message.Body;
    let sourceType = '';
    let messageText = '';
    try {
      const parsedMessageBody = JSON.parse(messageBody);
      if (parsedMessageBody && parsedMessageBody.Message) {
        messageText = parsedMessageBody.Message;
      }
      if (
        parsedMessageBody?.Type === 'Notification' &&
        parsedMessageBody?.TopicArn
      ) {
        sourceType = MessageSourceType.SNS;
      } else if (messageBody) {
        messageText = messageBody;
        sourceType = MessageSourceType.SQS;
      }
    } catch (error) {
      sourceType = MessageSourceType.SQS;
      messageText = messageBody;
    }
    return {
      messageText: messageText,
      sourceType: sourceType,
    };
  }

  private async saveMessageInDb(message: Message) {
    const { messageText, sourceType } = this.formatSQSMessage(message);

    const sqsMessage = new SqsMessage();
    sqsMessage.messageId = message.MessageId;
    sqsMessage.messageBody = message.Body;
    sqsMessage.processedAt = new Date();
    sqsMessage.sourceType = sourceType;
    sqsMessage.message = messageText;

    this.sqsMessageDao.createSqsMessage(sqsMessage);
  }

  private async processMessage(message: Message) {
    const sqsMessageFromDb = await this.sqsMessageDao.getSqsMessageById(
      message.MessageId,
    );

    if (!sqsMessageFromDb || !sqsMessageFromDb.processedAt) {
      //process message
      console.log('Received new message:', message.Body);
      this.saveMessageInDb(message);
    }
    this.deleteConsumedMessage(message.ReceiptHandle);
  }

  private pollMessages = () => {
    this.consumer = Consumer.create({
      queueUrl: this.queueUrl,
      handleMessage: async (message: Message) => {
        this.processMessage(message);
      },
      waitTimeSeconds: 1,
      pollingWaitTimeMs: 2000, //configure polling wait time
      shouldDeleteMessages: false, //if set to true, consumer will delete the messages
      sqs: this.sqsClient,
    });

    this.consumer.on('error', (err) => {
      console.error(err.message);
    });

    this.consumer.on('processing_error', (err) => {
      console.error(err.message);
    });

    this.consumer.on('timeout_error', (err) => {
      console.error(err.message);
    });

    this.consumer.start();
  };

  public async onModuleDestroy() {
    this.consumer?.stop({ abort: true });
  }
}
