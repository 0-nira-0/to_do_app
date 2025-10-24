import { IsString, Max, IsDate } from "class-validator";


export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  title: string;
  @IsString({ message: 'Description must be a string' })
  description?: string;
  @IsString({ message: 'Due date must be a string' })
  dueDate?: Date;
}

export class UpdateTaskDto {
  @IsString({ message: 'Task ID must be a string' })
  Id: number;

  @IsString({ message: 'Title must be a string' })
  @Max(100, { message: 'Title can have max 100 characters' })
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @Max(500, { message: 'Description can have max 500 characters' })
  description?: string;

  @IsString({ message: 'Due date must be a string' })
  @IsDate({ message: 'Due date must be a valid date' })
  dueDate?: Date;
}