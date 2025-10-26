import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from '../dto_task/tasks.dto';
import { Res, Req } from '@nestjs/common';
import type { Response } from 'express';
import { SessionService } from '../session/session.service';
import { Query } from '@nestjs/common';
import { TasksService } from './tasks.service';


@Controller()
export class TasksController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly tasksService: TasksService
    ) {}

  @Post('tasks')
  async createTask(@Body() dto: CreateTaskDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['session_token'];
    console.log(token)
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return  this.tasksService.createTask(dto, session.userId);
  }


  @Patch('tasks/:id')
  async updateTask(@Body() dto: UpdateTaskDto,@Param('id', ParseIntPipe) id:number ,@Req() req, @Res({ passthrough: true }) res: Response){
  const token = req.cookies['session_token'];
    console.log(token)
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return await this.tasksService.updateTask(dto, id, session.userId,)
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id', ParseIntPipe) id:number ,@Req() req, @Res({ passthrough: true }) res: Response){
    const token = req.cookies['session_token'];
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return await this.tasksService.deleteTask(id, session.userId,)
  }


  @Get('tasks/:id')
  async getTask(@Param('id', ParseIntPipe) id:number ,@Req() req, @Res({ passthrough: true }) res: Response){
    const token = req.cookies['session_token'];
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return await this.tasksService.getTask(id, session.userId,)
  }

   @Get('tasks')
  async getTasks(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Query('status') status: string = 'all',
    @Query('query') query?: string,
    @Query('dueFrom') dueFrom?: string,
    @Query('dueTo') dueTo?: string,
    @Query('includeNoDue') includeNoDue?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    
  ) {
    const token = req.cookies['session_token'];
    const session = await this.sessionService.getSessionByTokenAndUpdate(token);
    if (!session) throw new HttpException('invalid token', 401);
    this.refreshCookie(res, token);

    const pageNumber = Math.max(1, parseInt(String(page), 10) || 1);
    const limit = Math.max(1, parseInt(String(pageSize), 10) || 10);
    const offset = (pageNumber - 1) * limit;

    const opts = {
      userId: session.userId,
      status: (['all', 'pending', 'done'].includes(status) ? status : 'all') as 'all' | 'pending' | 'done',
      query,
      dueFrom,
      dueTo,
      includeNoDue: includeNoDue === 'true',
      limit,
      offset,
    };

    return this.tasksService.getTasks(opts);
  }


  private refreshCookie(res: Response, token: string) {
  res.cookie('session_token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: true,
    sameSite: 'strict',
  });
}
}

