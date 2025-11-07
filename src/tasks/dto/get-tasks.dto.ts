import { Task } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Status {
  pending = 'pending',
  done = 'done',
}

export class GetTasksDto {
  // @IsString()
  // userId: User['id'];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueTo?: Date;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeNoDue?: boolean;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsEnum(Status)
  status?: Task['status'];

  @IsOptional()
  @IsString()
  query?: string;
}
