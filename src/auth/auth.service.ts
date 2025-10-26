import { HttpException, Injectable } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto, TokenDto } from './dto/post-auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import * as crypto from 'crypto';
import { SessionService } from 'src/session/session.service';



@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly sessionService: SessionService
  ) {}

  async register(dto: RegisterUserDto) {
    const existing = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new HttpException('User already exists', 444);
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.db.user.create({
      data: {
        email: dto.email,
        password: hashed,
      },
    });
    
  const token = crypto.randomBytes(32).toString('hex');

  await this.sessionService.createSession(
    user.id,
    token,
    new Date(Date.now() + 60 * 60 * 24 * 30* 1000)
  );
  
  return { id: user.id, email: user.email, token };
  }

  async login(dto: LoginUserDto) {
    
    const existing = await this.db.user.findUnique({
      where: { email: dto.email },
    });

 
  if (!existing) {
    throw new HttpException('Invalid credentials', 401);
  }

  const isValid = await bcrypt.compare(dto.password, existing.password);
  if (!isValid) {
    throw new HttpException('Invalid credentials', 401);
  }
  
  const token = crypto.randomBytes(32).toString('hex');

  await this.sessionService.createSession(
    existing.id,
    token, //kogda my delaem sesiyu, my hashyruem token czerez hashToken v session.service
    new Date(Date.now() + 60 * 60 * 24 * 30* 1000)
    );
  
  return { id: existing.id, email: existing.email, token };
}

  async profile(token:string){
      const session = await this.sessionService.getSessionByToken(token)
      if (!session) throw new HttpException('Session not found', 404);
      return this.db.user.findUnique({
      where: { id: session.userId },
    });

  }

  async logout(tokenDto: TokenDto) {
    const token = tokenDto.token;
    const deleted = await this.sessionService.deleteSession(token);
    if (!deleted) throw new HttpException('Session not found', 404);
    return { message: 'Logged out successfully' };
}
}
