import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { CreateTaskDto, UpdateTaskDto } from './dto_task/tasks.dto';
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

  async updateTask(dto: UpdateTaskDto, id, userId) {
    const task = await this.db.task.findUnique({ where: { id } });
    if(!task) throw new HttpException('task not found', 404)
    if(task.userId !== userId) throw new HttpException('Not authorized', 401)
    const taskUpdate = await this.db.task.update({
      where: {
        id
      },
      data: {
        ...dto
      }
    });
  return {taskUpdate}
}

  async deleteTask(id , userId){
  const task = await this.db.task.findUnique({ where: { id } });
    if(!task) throw new HttpException('task not found', 404)
    if(task.userId !== userId) throw new HttpException('Not authorized', 401)
    const taskDelete = await this.db.task.delete({
      where: {
        id
      }
    });
  return {taskDelete}
}
}


// /limit /offset for pagination, limit for tasks limit on page, offset for skip tasks when page more than 1  