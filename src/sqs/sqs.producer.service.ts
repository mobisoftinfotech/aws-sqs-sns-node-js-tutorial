import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SqsProducerService {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor(private configService: ConfigService) {
    this.sqsClient = new SQSClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.queueUrl = this.configService.get('SQS_QUEUE_URL');
  }

  async sendMessage(message: string) {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: message,
        MessageGroupId: 'sqs-message-group',
        MessageDeduplicationId: uuid(),
      });

      const response = await this.sqsClient.send(command);
      console.log('SQS message sent: ', message);
      return response;
    } catch (error) {
      console.log('error', error);
    }
  }
}
