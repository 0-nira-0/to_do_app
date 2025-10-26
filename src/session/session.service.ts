import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  constructor(private readonly db: DatabaseService) {}

  async createSession(userId: number, token: string, expiresAt: Date) {
    const tokenHash = this.hashToken(token);

    return this.db.session.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

 async getSessionByTokenAndUpdate(token: string) {
    const tokenHash = this.hashToken(token);
    let session =  await this.db.session.findUnique({
      where: { tokenHash },
    });
    if(!session) throw new HttpException('invalid token', 401)

    if (session.expiresAt.getTime() <= Date.now() ){
    throw new HttpException('invalid token', 401) //redirect to login
  }
   await this.db.session.update({
      where: {
      tokenHash
     },
      data: {
     expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30* 1000)
      }
    })
    return session
  }

async deleteSession(token: string) {
  const tokenHash = this.hashToken(token);
  const session = await this.db.session.findUnique({ where: { tokenHash } });
  if (!session) throw new HttpException('Session not found', 404);

  return this.db.session.delete({ where: { tokenHash } });
}
  
    private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
