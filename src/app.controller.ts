import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTaskDto, UpdateTaskDto } from './dto_task/tasks.dto';
import { Res, Req } from '@nestjs/common';
import type { Response } from 'express';
import { SessionService } from './session/session.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sessionService: SessionService
    ) {}

  @Post('tasks')
  async createTask(@Body() dto: CreateTaskDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['session_token'];
    console.log(token)
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return  this.appService.createTask(dto, session.userId);
  }


  @Patch('tasks/:id')
  async updateTask(@Body() dto: UpdateTaskDto,@Param('id', ParseIntPipe) id:number ,@Req() req, @Res({ passthrough: true }) res: Response){
  const token = req.cookies['session_token'];
    console.log(token)
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return await this.appService.updateTask(dto, id, session.userId,)
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id', ParseIntPipe) id:number ,@Req() req, @Res({ passthrough: true }) res: Response){
    const token = req.cookies['session_token'];
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return await this.appService.deleteTask(id, session.userId,)
  }


  @Get('tasks/:id')
  async getTask(@Param('id', ParseIntPipe) id:number ,@Req() req, @Res({ passthrough: true }) res: Response){
    const token = req.cookies['session_token'];
    const session = await this.sessionService.getSessionByTokenAndUpdate(token)
    if (!session) throw new HttpException('invalid token', 401)
    this.refreshCookie(res, token)
    return await this.appService.getTask(id, session.userId,)
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
