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
import { Session, User } from '@prisma/client';
import { config } from 'src/config';
import type { UserInformation } from 'src/interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly sessionService: SessionService,
  ) {}

  private async buildUserResponse(user: User): Promise<UserInformation> {
    const { token, tokenId } = this.createTokenAndTokenId();
    await this.sessionService.create({ userId: user.id, token, tokenId });
    return { user: { id: user.id, email: user.email }, token, tokenId };
  }

  private createTokenAndTokenId() {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenId = crypto.randomBytes(32).toString('hex');
    return { token, tokenId };
  }

  async register(dto: RegisterUserDto): Promise<UserInformation> {
    const existingUser = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      config().session.saltHash,
    );

    const user = await this.db.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    return this.buildUserResponse(user);
  }

  async login(dto: LoginUserDto): Promise<UserInformation> {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildUserResponse(user);
  }

  async getUserByToken(tokenId: Session['tokenId'], token: string) {
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

    const user = await this.db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    };
  }

  async logout(tokenId: string) {
    const session = await this.db.session.findUnique({
      where: { tokenId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionService.delete(tokenId);
  }
}
