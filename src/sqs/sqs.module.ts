import { Module } from '@nestjs/common';
import { SqsProducerService } from './sqs.producer.service';
import { SqsConsumerService } from './sqs.consumer.service';
import { SqsController } from './sqs.controller';
import { SqsMessageDao } from './daos/sqs-message.dao';

@Module({
  imports: [],
  controllers: [SqsController],
  providers: [SqsProducerService, SqsConsumerService, SqsMessageDao],
  exports: [SqsProducerService, SqsConsumerService],
})
export class SqsModule {}
