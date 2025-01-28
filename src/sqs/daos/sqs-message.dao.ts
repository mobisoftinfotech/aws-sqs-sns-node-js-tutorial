import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SqsMessage } from '../models/sqs-message';

@Injectable()
export class SqsMessageDao {
  constructor(private readonly dataSource: DataSource) {}
  public async createSqsMessage(message: SqsMessage): Promise<SqsMessage> {
    return await this.dataSource.manager.transaction(async (manager) => {
      return await manager.save(message);
    });
  }

  public async getSqsMessageById(messageId: string): Promise<SqsMessage> {
    return await this.dataSource.manager.transaction(async (manager) => {
      return await manager
        .createQueryBuilder()
        .select('s')
        .from(SqsMessage, 's')
        .where('s.deletedAt IS NULL')
        .andWhere('s.messageId = :messageId', { messageId })
        .getOne();
    });
  }
}
