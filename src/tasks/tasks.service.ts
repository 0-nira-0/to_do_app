import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { User, Prisma } from '@prisma/client';
import { GetTasksDto } from './dto/get-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly db: DatabaseService) {}

  async createTask(dto: CreateTaskDto, userId: User['id']) {
    return this.db.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate,
      },
    });
  }

  async updateTask(dto: UpdateTaskDto, id: number, userId: number) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) throw new HttpException('task not found', 404);
    if (task.userId !== userId) throw new HttpException('Not authorized', 401);
    const updatedTask = await this.db.task.update({ where: { id }, data: dto });
    return { message: 'Task updated successfully', task: updatedTask };
  }

  async deleteTask(id: number) {
    const deletedTask = await this.db.task.delete({ where: { id } });
    return { message: 'Task deleted successfully', task: deletedTask };
  }

  async getTask(id: number, userId: number) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) throw new HttpException('task not found', 404);
    if (task.userId !== userId) throw new HttpException('Not authorized', 401);
    return task;
  }

  async getTasks(opts: GetTasksDto) {
    const {
      userId,
      status,
      query,
      dueFrom,
      dueTo,
      includeNoDue,
      limit,
      offset,
    } = opts;

    const where: Prisma.TaskWhereInput = { userId };

    (() =>
      status && (status as any) !== 'all' ? (where.status = status) : null)();

    (() =>
      query
        ? (where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ])
        : null)();

    const dateFilter: Prisma.DateTimeFilter = {};
    (() => (dueFrom ? (dateFilter.gte = new Date(dueFrom)) : null))();
    (() => (dueTo ? (dateFilter.lte = new Date(dueTo)) : null))();

    const orArr: Prisma.TaskWhereInput[] = [];
    (() => (includeNoDue ? orArr.push({ dueDate: null }) : null))();
    (() =>
      Object.keys(dateFilter).length
        ? orArr.push({ dueDate: dateFilter })
        : null)();

    (() =>
      orArr.length
        ? where.OR
          ? ((where.AND = [{ OR: where.OR }, { OR: orArr }]), delete where.OR)
          : (where.OR = orArr)
        : null)();

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
