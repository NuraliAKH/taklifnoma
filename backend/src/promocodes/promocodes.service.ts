import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreatePromocodeDto {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_uses?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
  partner_name?: string;
}

@Injectable()
export class PromocodesService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(code: string, orderAmount: number = 0) {
    if (!code) {
      throw new BadRequestException('Введите промокод');
    }

    const cleanCode = code.trim().toUpperCase();
    const promocode = await this.prisma.promocode.findUnique({
      where: { code: cleanCode },
    });

    if (!promocode) {
      throw new BadRequestException('Промокод не найден');
    }

    if (!promocode.is_active) {
      throw new BadRequestException('Промокод неактивен');
    }

    const now = new Date();
    if (promocode.valid_from && new Date(promocode.valid_from) > now) {
      throw new BadRequestException('Срок действия промокода еще не начался');
    }

    if (promocode.valid_until && new Date(promocode.valid_until) < now) {
      throw new BadRequestException('Срок действия промокода истек');
    }

    if (promocode.uses_count >= promocode.max_uses) {
      throw new BadRequestException('Лимит использования промокода исчерпан');
    }

    const minAmount = Number(promocode.min_order_amount || 0);
    if (orderAmount < minAmount) {
      throw new BadRequestException(
        `Минимальная сумма заказа для применения промокода: ${minAmount.toLocaleString('ru-RU')} сум`,
      );
    }

    // Calculate discount
    const discountVal = Number(promocode.discount_value);
    let discountAmount = 0;

    if (promocode.discount_type === 'percentage') {
      discountAmount = Math.round((orderAmount * discountVal) / 100);
    } else {
      discountAmount = Math.min(discountVal, orderAmount);
    }

    let finalPrice = Math.max(0, orderAmount - discountAmount);

    // Enforce Click minimum payment limit (1000 SUM)
    if (finalPrice > 0 && finalPrice < 1000) {
      finalPrice = 1000;
      discountAmount = Math.max(0, orderAmount - finalPrice);
    }

    return {
      valid: true,
      promocodeId: promocode.id,
      code: promocode.code,
      discountType: promocode.discount_type,
      discountValue: discountVal,
      discountAmount,
      originalPrice: orderAmount,
      finalPrice,
      partnerName: promocode.partner_name || null,
      message: `Промокод "${promocode.code}" успешно применен! Скидка: ${discountAmount.toLocaleString('ru-RU')} сум`,
    };
  }

  async findAll() {
    const promocodes = await this.prisma.promocode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return promocodes.map(p => ({
      ...p,
      discount_value: Number(p.discount_value),
      min_order_amount: Number(p.min_order_amount),
    }));
  }

  async create(dto: CreatePromocodeDto) {
    const cleanCode = dto.code.trim().toUpperCase();

    const existing = await this.prisma.promocode.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      throw new BadRequestException(`Промокод "${cleanCode}" уже существует`);
    }

    return this.prisma.promocode.create({
      data: {
        code: cleanCode,
        discount_type: dto.discount_type || 'percentage',
        discount_value: dto.discount_value,
        min_order_amount: dto.min_order_amount || 0,
        max_uses: dto.max_uses || 100,
        valid_from: dto.valid_from ? new Date(dto.valid_from) : null,
        valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
        is_active: dto.is_active !== undefined ? dto.is_active : true,
        partner_name: dto.partner_name || null,
      },
    });
  }

  async update(id: number, dto: Partial<CreatePromocodeDto>) {
    const promocode = await this.prisma.promocode.findUnique({ where: { id } });
    if (!promocode) {
      throw new NotFoundException(`Промокод с ID ${id} не найден`);
    }

    const dataToUpdate: any = {};
    if (dto.code) dataToUpdate.code = dto.code.trim().toUpperCase();
    if (dto.discount_type) dataToUpdate.discount_type = dto.discount_type;
    if (dto.discount_value !== undefined) dataToUpdate.discount_value = dto.discount_value;
    if (dto.min_order_amount !== undefined) dataToUpdate.min_order_amount = dto.min_order_amount;
    if (dto.max_uses !== undefined) dataToUpdate.max_uses = dto.max_uses;
    if (dto.valid_from !== undefined) dataToUpdate.valid_from = dto.valid_from ? new Date(dto.valid_from) : null;
    if (dto.valid_until !== undefined) dataToUpdate.valid_until = dto.valid_until ? new Date(dto.valid_until) : null;
    if (dto.is_active !== undefined) dataToUpdate.is_active = dto.is_active;
    if (dto.partner_name !== undefined) dataToUpdate.partner_name = dto.partner_name || null;

    return this.prisma.promocode.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    const promocode = await this.prisma.promocode.findUnique({ where: { id } });
    if (!promocode) {
      throw new NotFoundException(`Промокод с ID ${id} не найден`);
    }

    return this.prisma.promocode.delete({
      where: { id },
    });
  }

  async incrementUses(id: number) {
    try {
      await this.prisma.promocode.update({
        where: { id },
        data: {
          uses_count: { increment: 1 },
        },
      });
    } catch (e) {
      // Ignore if promocode was deleted
    }
  }

  async seedDefaultPromocodes() {
    const defaultCodes = [
      {
        code: 'TOY2026',
        discount_type: 'percentage',
        discount_value: 15,
        min_order_amount: 50000,
        max_uses: 500,
        is_active: true,
        partner_name: 'Сезон Свадеб 2026',
      },
      {
        code: 'WELCOME10',
        discount_type: 'fixed',
        discount_value: 10000,
        min_order_amount: 30000,
        max_uses: 1000,
        is_active: true,
        partner_name: 'Приветственный бонус',
      },
    ];

    for (const p of defaultCodes) {
      await this.prisma.promocode.upsert({
        where: { code: p.code },
        update: {},
        create: p,
      });
    }
  }
}
