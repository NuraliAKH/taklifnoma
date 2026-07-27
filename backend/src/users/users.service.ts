import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(email: string, passwordPlain: string, role: 'admin' | 'user' = 'user'): Promise<User> {
    const password_hash = await bcrypt.hash(passwordPlain, 10);
    const user = this.userRepository.create({
      email,
      password_hash,
      role,
    });
    return this.userRepository.save(user);
  }

  private async seedAdmin() {
    const adminEmail = 'admin@invite.ru';
    const existing = await this.findByEmail(adminEmail);
    if (!existing) {
      console.log(`[Users] Seeding default admin user: ${adminEmail}`);
      await this.create(adminEmail, 'admin123', 'admin');
    }
  }
}
