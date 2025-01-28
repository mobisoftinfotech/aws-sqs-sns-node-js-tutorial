import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sqs_message' })
export class SqsMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  messageId: string;

  @Column({ name: 'message_body' })
  messageBody: string;

  @Column({ name: 'processed_at' })
  processedAt: Date;

  @Column({ name: 'message' })
  message: string;

  @Column({ name: 'source_type' })
  sourceType: string;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
