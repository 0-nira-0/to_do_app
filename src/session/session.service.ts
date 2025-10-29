import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { config } from 'src/config';

type CreateSessionOptions = { userId: number; token: string; tokenId: string };
@Injectable()
export class SessionService {
  constructor(private readonly db: DatabaseService) {}

  async create({ token, userId, tokenId }: CreateSessionOptions) {
    const tokenHash = await bcrypt.hash(token, 10);
    return this.db.session.create({
      data: {
        tokenId,
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + config().session.maxAge),
      },
    });
  }

  async update(tokenId: string, token: string) {
    const session = await this.db.session.findUnique({
      where: { tokenId },
    });
    if (!session) throw new UnauthorizedException('invalid token');

    const tokenCheck = await bcrypt.compare(token, session.tokenHash);

    if (!tokenCheck) throw new UnauthorizedException('Not authorized');

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('invalid token'); //redirect to login
    }
    const updatedSession = await this.db.session.update({
      where: {
        tokenId,
      },
      data: {
        expiresAt: new Date(Date.now() + config().session.maxAge),
      },
    });
    return updatedSession;
  }

  async delete(tokenId: string) {
    return this.db.session.delete({ where: { tokenId } });
  }
}
