import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService ) {}

  // async createTask(//dto for task creation) {
  //   //logic to create task
  //   return this.db.task.create({
  //     data: {
  //       //task data from dto
  //     },
  //   });
  }

