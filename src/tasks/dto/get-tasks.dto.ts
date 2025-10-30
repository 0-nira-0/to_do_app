import { Status, Task } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetTasksDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsDate()
  dueFrom: Date;

  @IsOptional()
  @IsDate()
  dueTo: Date;

  @IsOptional()
  @IsBoolean()
  includeNoDue: boolean;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  offset: number;

  @IsOptional()
  @IsEnum(Status)
  status: Task['status'];

  @IsOptional()
  @IsString()
  query: string;
}
