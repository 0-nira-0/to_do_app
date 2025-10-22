import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @MaxLength(64, { message: 'max 64 symbols' })
  @IsEmail({}, { message: 'btw, invalid email' })
  email: string;

  @MaxLength(64, { message: 'max 67 symbols' })
  @IsString({ message: 'passwrod must be a string' })
  @MinLength(6, { message: 'min 6 symdobls' })
  password: string;
}

export class LoginUserDto {
  @MaxLength(64, { message: 'max 64 symbols' })
  @IsEmail({}, { message: 'btw, invalid email' })
  email: string;

  @MaxLength(64, { message: 'max 64 symbols' })
  @IsString({ message: 'passwrod must be a string' })
  @MinLength(6, { message: 'min 6 symdobls' })
  password: string;
}