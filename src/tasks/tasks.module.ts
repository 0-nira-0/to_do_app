import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [AuthModule, DatabaseModule, SessionModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
