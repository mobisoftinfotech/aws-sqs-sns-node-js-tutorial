import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SnsPublisherService {
  private snsClient: SNSClient;
  private topicArn: string;

  constructor(private configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.topicArn = this.configService.get('SNS_TOPIC_ARN');
  }

  async publishMessage(message: string) {
    try {
      const command = new PublishCommand({
        TopicArn: this.topicArn,
        Message: message,
        MessageGroupId: 'sns-message-group',
        MessageDeduplicationId: uuid(),
      });

      const response = await this.snsClient.send(command);
      console.log('SNS message sent: ', message);
      return response;
    } catch (error) {
      console.log('Error', error);
    }
  }
}
