import { IsString, Max, IsDate, isNumber, IsOptional, MaxLength } from "class-validator";


export class CreateTaskDto {

  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'string can have max 100 characters'})
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(100, { message: 'Description can have max 500 characters'})
  description?: string;

  @IsOptional()
  @IsDate({ message: 'Due date must be a valid date' })
  dueDate?: Date;
}

export class UpdateTaskDto {
  @IsString({ message: 'Task ID must be a string' })
  Id: number;

  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title can have max 100 characters' })
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description can have max 500 characters' })
  description?: string;

  @IsDate({ message: 'Due date must be a valid date' })
  dueDate?: Date;
}