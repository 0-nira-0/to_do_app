import { Injectable } from '@nestjs/common';
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
      throw new Error('User already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.db.user.create({
      data: {
        email: dto.email,
        password: hashed,
      },
    });

    return { id: user.id, email: user.email };
  }
}
