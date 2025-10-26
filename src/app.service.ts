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

  return { message: 'Task created successfully', task: this.createTask };
  }

  async updateTask(dto: UpdateTaskDto, id, userId) {
    const task = await this.db.task.findUnique({ where: { id } });
    if(!task) throw new HttpException('task not found', 404)
    if(task.userId !== userId) throw new HttpException('Not authorized', 401)
    const updatedTask = await this.db.task.update({
      where: {
        id
      },
      data: {
        ...dto
      }
    });
  return { message: 'Task updated successfully', task: updatedTask};
}

  async deleteTask(id , userId){
  const task = await this.db.task.findUnique({ where: { id } });
    if(!task) throw new HttpException('task not found', 404)
    if(task.userId !== userId) throw new HttpException('Not authorized', 401)
    const deletedTask = await this.db.task.delete({
      where: {
        id
      }
    });
  return { message: 'Task deleted successfully', task: deletedTask };
}

  async getTask(id , userId){
  const task = await this.db.task.findUnique({ where: { id } });
    if(!task) throw new HttpException('task not found', 404)
    if(task.userId !== userId) throw new HttpException('Not authorized', 401)
  return task
}
}


// /limit /offset for pagination, limit for tasks limit on page, offset for skip tasks when page more than 1  