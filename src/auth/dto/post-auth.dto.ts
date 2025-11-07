import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @MaxLength(64)
  @IsEmail({})
  email: string;

  @MaxLength(64)
  @IsString()
  @MinLength(6) //custom class-validator
  password: string;
}

export class LoginUserDto {
  @MaxLength(64)
  @IsEmail({})
  email: string;

  @MaxLength(64)
  @IsString()
  @MinLength(6)
  password: string;
}
