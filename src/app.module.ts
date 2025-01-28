import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnsModule } from './sns/sns.module';
import { SqsModule } from './sqs/sqs.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsMessage } from './sqs/models/sqs-message';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: [SqsMessage],
      synchronize: true, // Automatically sync the database schema (disable in production)
    }),
    TypeOrmModule.forFeature([SqsMessage]),
    SnsModule,
    SqsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
