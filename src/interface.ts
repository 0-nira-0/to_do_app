import type { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedUser {
  id: User['id'];
  email: string;
  createdAt: Date;
}

export interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

export interface RequestWithUser extends RequestWithCookies {
  user?: AuthenticatedUser;
}

export interface UserInformation {
  user: Pick<User, 'id' | 'email'>;
  token: string;
  tokenId: string;
}

export type CreateSessionOptions = {
  userId: string;
  token: string;
  tokenId: string;
};
