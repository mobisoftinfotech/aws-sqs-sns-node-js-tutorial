import { Module } from '@nestjs/common';
import { SnsPublisherService } from './sns.publisher.service';
import { SnsController } from './sns.controller';

@Module({
  imports: [],
  controllers: [SnsController],
  providers: [SnsPublisherService],
  exports: [SnsPublisherService],
})
export class SnsModule {}
