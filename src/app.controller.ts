import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTaskDto } from './dto_task/tasks.dto';
import { Res, Req } from '@nestjs/common';
import type { Response } from 'express';
import { SessionService } from './session/session.service';
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly sessionService: SessionService
  ) {}

  @Post('tasks')
  async createTask(@Body() dto: CreateTaskDto, @Req() req) {
    const token = req.cookies['session_token'];
    console.log(token)
    const session = await this.sessionService.getSessionByToken(token)
    if (!session) throw new HttpException('invalid token', 401)
    return this.appService.createTask(dto, session.userId);
  }
}
//  @Post('tasks')
//   async createTask(@Body() dto: //dto for task creation) {
//     //logic to create task
//     return this.appService.createTask();
//   }

//   @Get('tasks')
//   async getTasks() {
//     //logic to get tasks
//     return this.appService.getTasks();
//   }
//   //create tasks and assign to user
//   //pagination for tasks
//   //sort tasks by title, date, status
//   //create crud endpoints for tasks
//   //all logic in app service
//   //protect all endpoints with jwt auth guard
//   //jeszcze nie pridumalem co tutaj moze byc

// 

