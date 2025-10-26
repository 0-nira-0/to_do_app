
import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto_task/tasks.dto';
import { SessionService } from '../session/session.service';
@Injectable()
export class TasksService {
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

  return { message: 'Task created successfully', task };
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

 async getTasks(opts: {
    userId: number;
    status?: 'all' | 'pending' | 'done';
    query?: string;
    dueFrom?: string;
    dueTo?: string;
    includeNoDue?: boolean;
    limit: number;
    offset: number;
  }) {
    const { userId, status, query, dueFrom, dueTo, includeNoDue, limit, offset } = opts;

    const where: any = { userId };

    if (status && status !== 'all') where.status = status;

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (dueFrom || dueTo || includeNoDue) {
      const dateFilter: any = {};
      if (dueFrom) dateFilter.gte = new Date(dueFrom);
      if (dueTo) dateFilter.lte = new Date(dueTo);

      const orArr: any[] = [];
      if (includeNoDue) orArr.push({ dueDate: null });
      if (Object.keys(dateFilter).length) orArr.push({ dueDate: dateFilter });

      if (where.OR) {
        where.AND = [{ OR: where.OR }];
        delete where.OR;
        where.AND.push({ OR: orArr });
      } else {
        where.OR = orArr;
      }
    }

    const [tasks, total] = await this.db.$transaction([
      this.db.task.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}


