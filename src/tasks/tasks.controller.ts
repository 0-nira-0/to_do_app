import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

import { AuthGuard } from 'src/auth/auth.guard';

import { CurrentUser } from 'src/auth/decorators/user.decorator';
import type { User } from '@prisma/client';

@Controller()
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('tasks')
  async createTask(
    @Body() dto: CreateTaskDto,
    @CurrentUser('id') userId: User['id'],
  ) {
    const task = await this.tasksService.createTask(dto, userId);
    return { task };
  }

  @Patch('tasks/:id')
  async updateTask(
    @Body() dto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: User['id'],
  ) {
    const task = await this.tasksService.updateTask(dto, id, userId);
    return { task };
  }

  @Delete('tasks/:id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: User['id'],
  ) {
    const task = await this.tasksService.deleteTask(id, userId);
    return { task };
  }

  @Get('tasks/:id')
  async getTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: User['id'],
  ) {
    const task = await this.tasksService.getTask(id, userId);
    return { task };
  }

  @Get('tasks')
  async getTasks(
    @Query() dto: GetTasksDto,
    @CurrentUser('id') userId: User['id'],
  ) {
    const tasks = await this.tasksService.getTasks({ ...dto, userId });
    return { tasks };
  }
}
