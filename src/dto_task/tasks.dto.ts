import { IsString, Max, IsDate, isNumber, IsOptional, MaxLength } from "class-validator";
import { Type } from 'class-transformer';

export class CreateTaskDto {

  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'string can have max 100 characters'})
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(100, { message: 'Description can have max 500 characters'})
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Due date must be a valid date' })
  dueDate?: Date;
}

export class UpdateTaskDto {

  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title can have max 100 characters' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description can have max 500 characters' })
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Due date must be a valid date' })
  dueDate?: Date;

  @IsOptional()
  @IsString({message: 'must be done or pending'})
  status?: 'pending' | 'done'
}