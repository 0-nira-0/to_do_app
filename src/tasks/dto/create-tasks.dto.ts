import { IsString, IsDate, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;
}
