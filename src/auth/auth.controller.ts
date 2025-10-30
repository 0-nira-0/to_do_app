import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/post-auth.dto';
import type { Response, Request } from 'express';
import { Res, Req } from '@nestjs/common';
import { config } from 'src/config';
import type { RequestWithUser } from 'src/config';
import { AuthGuard } from './auth.guard';
import { UseGuards } from '@nestjs/common';
interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private checkCookie(req: RequestWithCookies) {
    const cookie = req.cookies[config().session.cookieKey];
    if (!cookie) throw new UnauthorizedException('Not authorized');
    const [token, tokenId] = cookie.split(':');
    return [token, tokenId];
  }

  private clearCookie(response: Response) {
    response.clearCookie(config().session.cookieKey, {
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  private setSessionCookie(response: Response, token: string, tokenId: string) {
    const cookieValue = `${token}:${tokenId}`;
    response.cookie(config().session.cookieKey, cookieValue, {
      httpOnly: true,
      maxAge: config().session.maxAge,
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);

    this.setSessionCookie(res, result.token, result.tokenId);

    return { message: 'Registration successful', user: result };
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    this.setSessionCookie(res, result.token, result.tokenId);

    return { message: 'Login successful', user: result };
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const [, tokenId] = this.checkCookie(req);

    this.clearCookie(res);

    return await this.authService.logout(tokenId);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  profile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
