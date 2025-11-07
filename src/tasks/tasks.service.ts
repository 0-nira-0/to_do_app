import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { User, Prisma, Task } from '@prisma/client';
import { GetTasksDto } from './dto/get-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly db: DatabaseService) {}

  private async findTask(id: Task['id'], userId: User['id']) {
    const task = await this.db.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Forbidden');
    return task;
  }

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

  async updateTask(dto: UpdateTaskDto, id: Task['id'], userId: User['id']) {
    await this.findTask(id, userId);
    const updatedTask = await this.db.task.update({ where: { id }, data: dto });
    return updatedTask;
  }

  async deleteTask(id: number, userId: User['id']) {
    await this.findTask(id, userId);
    const deletedTask = await this.db.task.delete({ where: { id } });
    return deletedTask;
  }

  async getTask(id: number, userId: User['id']) {
    const task = await this.findTask(id, userId);
    return task;
  }

  async getTasks(dto: GetTasksDto & { userId: User['id'] }) {
    const {
      userId,
      dueFrom,
      dueTo,
      includeNoDue,
      limit = 10,
      offset = 0,
      query = '',
      status,
    } = dto;
    const pagination = this.getPagination({ offset, limit });
    console.log('includeNoDue:', includeNoDue, typeof includeNoDue);
    const where = {
      userId,
      AND: [
        { status },
        {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        includeNoDue
          ? dueFrom || dueTo
            ? {
                OR: [
                  { dueDate: { equals: null } },
                  { dueDate: { gte: dueFrom, lte: dueTo } },
                ],
              }
            : { dueDate: { equals: null } }
          : dueFrom || dueTo
            ? { dueDate: { gte: dueFrom, lte: dueTo } }
            : { dueDate: { not: null } },
      ],
    } satisfies Prisma.TaskWhereInput;

    return this.db.task.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
    });
  }

  // async getTasks(opts: GetTasksDto) {
  //   const {
  //     userId,
  //     status,
  //     query,
  //     dueFrom,
  //     dueTo,
  //     includeNoDue,
  //     limit = 10,
  //     offset = 0,
  //   } = opts;

  //   const where: Prisma.TaskWhereInput = { userId };

  //   if (status && status !== 'all') {
  //     where.status = status;
  //   }

  //   if (query) {
  //     where.OR = [
  //       { title: { contains: query, mode: 'insensitive' } },
  //       { description: { contains: query, mode: 'insensitive' } },
  //     ];
  //   }

  //   const dateFilter: Prisma.DateTimeFilter = {};
  //   if (dueFrom) dateFilter.gte = new Date(dueFrom);
  //   if (dueTo) dateFilter.lte = new Date(dueTo);

  //   const dueConditions: Prisma.TaskWhereInput[] = [];
  //   if (Object.keys(dateFilter).length)
  //     dueConditions.push({ dueDate: dateFilter });
  //   if (includeNoDue) dueConditions.push({ dueDate: null });

  //   if (dueConditions.length > 0) {
  //     if (where.OR) {
  //       where.AND = [{ OR: where.OR }, { OR: dueConditions }];
  //       delete where.OR;
  //     } else {
  //       where.OR = dueConditions;
  //     }
  //   }

  //   const { take, skip, page, pageSize } = this.getPagination(limit, offset);

  //   const [tasks, total] = await this.db.$transaction([
  //     this.db.task.findMany({
  //       where,
  //       take,
  //       skip,
  //       orderBy: { createdAt: 'desc' },
  //     }),
  //     this.db.task.count({ where }),
  //   ]);

  //   return {
  //     tasks,
  //     pagination: this.buildPagination(total, page, pageSize),
  //   };
  // }

  private getPagination({ limit, offset }: { limit: number; offset: number }) {
    const pageSize = Math.max(1, Math.min(limit, 100));
    const safeOffset = Math.max(0, offset);
    // const page = Math.floor(safeOffset / pageSize) + 1;

    return { take: pageSize, skip: safeOffset };
  }

  private buildPagination(total: number, page: number, pageSize: number) {
    return {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
