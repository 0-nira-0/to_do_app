import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto, LoginUserDto } from './dto/post-auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import * as crypto from 'crypto';
import { SessionService } from 'src/session/session.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly sessionService: SessionService,
  ) {}

  private createTokenAndTokenId() {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenId = crypto.randomBytes(32).toString('hex');
    return { token, tokenId };
  }

  async register(dto: RegisterUserDto): Promise<{
    user: { id: User['id']; email: User['email'] };
    token: string;
    tokenId: string;
  }> {
    const existingUser = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.db.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    const { token, tokenId } = this.createTokenAndTokenId();
    const params = { userId: user.id, token, tokenId };

    await this.sessionService.create(params);

    return { user: { id: user.id, email: user.email }, token, tokenId };
  }

  async login(dto: LoginUserDto): Promise<{
    user: { id: User['id']; email: User['email'] };
    token: string;
    tokenId: string;
  }> {
    const existing = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!existing) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, existing.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { token, tokenId } = this.createTokenAndTokenId();
    await this.sessionService.create(
      {
        userId: existing.id,
        token,
        tokenId,
      },
      // existing.id,
      // token, //kogda my delaem sesiyu, my hashyruem token czerez hashToken v session.service
    );

    return { user: { id: existing.id, email: existing.email }, token, tokenId };
  }

  async getUserByToken(tokenId: string, token: string) {
    const session = await this.db.session.findUnique({
      where: { tokenId },
    });
    if (!session) throw new NotFoundException('Session not found');
    const checkToken = await bcrypt.compare(token, session.tokenHash);
    if (!checkToken) throw new UnauthorizedException('Not authorized');
    const user = await this.db.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      return undefined;
    }
    return {
      user: { email: user.email, createdAt: user.createdAt, id: user.id },
    };
  }

  async logout(tokenId: string) {
    try {
      await this.sessionService.delete(tokenId);
    } catch {
      throw new NotFoundException('Session not found');
    }
  }
}
