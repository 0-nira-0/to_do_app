import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [AuthModule, DatabaseModule, SessionModule, TasksModule],
})
export class AppModule {}
