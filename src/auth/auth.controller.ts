import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto, TokenDto } from './dto/post-auth.dto';
import type { Response } from 'express';
import { Res, Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    res.cookie('session_token', result.token, { httpOnly: true });
    return { message: 'Registration successful', user: result };
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    res.cookie('session_token', result.token, { httpOnly: true });
    return { message: 'Login successful', user: result };
  }

  @Post('logout')
  async logout(@Body() tokenDto: TokenDto, @Req() req, @Res({ passthrough: true }) res: Response) {
     console.log(req.cookies);

    res.clearCookie('session_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
      
    return await this.authService.logout(tokenDto);
}

  @Get('me')
  async profile(@Req() req) {
    const token = req.cookies['session_token'];
    return await this.authService.profile(token);
  }
}
