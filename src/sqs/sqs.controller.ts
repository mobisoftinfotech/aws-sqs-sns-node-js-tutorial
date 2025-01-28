import { Controller, Post, Body } from '@nestjs/common';
import { SqsProducerService } from './sqs.producer.service';

@Controller('sqs')
export class SqsController {
  constructor(private sqsProducerService: SqsProducerService) {}

  @Post('publish')
  async publishMessage(@Body() body: { message: string }) {
    const { message } = body;
    const messageResponse = await this.sqsProducerService.sendMessage(message);
    return {
      status: 'Message published',
      message,
      messageId: messageResponse.MessageId,
    };
  }
}
