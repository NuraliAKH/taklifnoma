import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(email: string, passwordPlain: string, role: 'admin' | 'user' = 'user'): Promise<User> {
    const password_hash = await bcrypt.hash(passwordPlain, 10);
    return this.prisma.user.create({
      data: {
        email,
        password_hash,
        role,
      },
    });
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
