import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { config } from 'src/config';
import type { CreateSessionOptions } from 'src/interface';

@Injectable()
export class SessionService {
  constructor(private readonly db: DatabaseService) {}

  async create({ token, userId, tokenId }: CreateSessionOptions) {
    const tokenHash = await bcrypt.hash(token, config().session.saltHash);
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

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    const isTokenValid = await bcrypt.compare(token, session.tokenHash);

    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Session expired');
    }

    return this.db.session.update({
      where: { tokenId },
      data: {
        expiresAt: new Date(Date.now() + config().session.maxAge),
      },
    });
  }

  async delete(tokenId: string) {
    const session = await this.db.session.findUnique({
      where: { tokenId },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid token 1111');
    }

    return this.db.session.delete({ where: { tokenId } });
  }
}
