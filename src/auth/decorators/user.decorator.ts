import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/interface';

export const CurrentUser = createParamDecorator<
  keyof NonNullable<RequestWithUser['user']> | undefined
>((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  const user = request.user;

  if (!user) return null;

  return data ? user[data] : user;
});
