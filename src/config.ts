import type { Request } from 'express';

export interface RequestWithUser extends Request {
  cookies: Record<string, string>;
  user?: {
    id: number;
    email: string;
    createdAt: Date;
  };
}

export function config() {
  return {
    session: {
      cookieKey: 'session_token',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  };
}
