import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterUserDto } from './auth/dto/post-auth.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create')
  create(@Body() dto: RegisterUserDto) {
    return dto;
  }

}
