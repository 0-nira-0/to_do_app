import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { CreateTaskDto } from './dto_task/tasks.dto';
import { SessionService } from './session/session.service';
@Injectable()
export class AppService {
  constructor(
  private readonly db: DatabaseService , 
  private readonly sessionService: SessionService
  ) {}

  async createTask(dto: CreateTaskDto, userId) {
    
    const task = await this.db.task.create({
      data:{
      userId: userId,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate
    },
  });

  return {task}
  }

  async getTask(dto: CreateTaskDto){
    await this.db.task.findMany()

  }
}



// /limit /offset for pagination, limit for tasks limit on page, offset for skip tasks when page more than 1  