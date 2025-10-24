import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterUserDto } from './auth/dto/post-auth.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

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
}
