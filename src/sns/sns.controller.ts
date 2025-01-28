import { Controller, Post, Body } from '@nestjs/common';
import { SnsPublisherService } from './sns.publisher.service';

@Controller('sns')
export class SnsController {
  constructor(private snsService: SnsPublisherService) {}

  @Post('publish')
  async publishMessage(@Body() body: { message: string }) {
    const { message } = body;
    const messageResponse = await this.snsService.publishMessage(message);
    return {
      status: 'Message published',
      message,
      messageId: messageResponse.MessageId,
    };
  }
}
