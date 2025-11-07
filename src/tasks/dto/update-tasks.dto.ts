import {
  IsString,
  IsDate,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Status {
  pending = 'pending',
  done = 'done',
}
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsString()
  @IsEnum(Status)
  status?: Status;
}
