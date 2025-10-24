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

 async getSessionByToken(token: string) {
    const tokenHash = this.hashToken(token);
    return this.db.session.findUnique({
      where: { tokenHash },
    });
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
