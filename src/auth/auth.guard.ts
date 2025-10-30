import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { config } from 'src/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
  user: {
    email: string;
    createdAt: Date;
    id: number;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithCookies>();
    const cookie = req.cookies[config().session.cookieKey];

    if (!cookie) throw new UnauthorizedException();

    const [token, tokenId] = cookie.split(':');
    const user = await this.authService.getUserByToken(tokenId, token);

    if (!user) {
      throw new UnauthorizedException();
    }
    req.user = user.user;

    return true;
  }
}
