import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
