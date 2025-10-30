import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { SessionService } from '../session/session.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { RequestWithUser } from 'src/config';

@Controller()
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly tasksService: TasksService,
  ) {}

  private getUserId(req: RequestWithUser): number {
    if (!req.user || !req.user.id) {
      throw new NotFoundException('User not found');
    }
    return req.user.id;
  }

  @Post('tasks')
  async createTask(@Body() dto: CreateTaskDto, @Req() req: RequestWithUser) {
    const userId = this.getUserId(req);
    const task = await this.tasksService.createTask(dto, userId);
    return { task };
  }

  @Patch('tasks/:id')
  async updateTask(
    @Body() dto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.updateTask(dto, id, userId);
  }

  @Delete('tasks/:id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    this.getUserId(req);
    return this.tasksService.deleteTask(id);
  }

  @Get('tasks/:id')
  async getTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.getTask(id, userId);
  }

  @Get('tasks')
  async getTasks(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
    @Query() dto: GetTasksDto,
  ) {
    const userId = this.getUserId(req);
    return this.tasksService.getTasks({ ...dto, userId });
  }
}
