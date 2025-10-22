import { HttpException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/post-auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

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
    //give jwt token
    //after jwt token, proxy to app endpoint
    return { id: user.id, email: user.email };
  }

  async login(dto: RegisterUserDto) {
    const existing = await this.db.user.findUnique({
      where: { email: dto.email },
      //check password, by comparing hashed password with bcrypt
    });

    if (existing) {
      // give jwt token
      //after jwt token, proxy to app endpoint
    }
    throw new HttpException('Invalid credentials', 401);
  }
}
