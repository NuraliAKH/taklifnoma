import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';
import { TemplatesService } from '../templates/templates.service';
import sharp from 'sharp';

import { join } from 'path';
import * as fs from 'fs';

function formatPhoneNumber(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return value;

  let numberPart = digits;
  if (digits.startsWith('998')) {
    numberPart = digits.slice(3);
  }
  
  numberPart = numberPart.slice(0, 9);
  
  let result = '+998';
  if (numberPart.length > 0) {
    result += ` (${numberPart.slice(0, 2)}`;
  }
  if (numberPart.length > 2) {
    result += `) ${numberPart.slice(2, 5)}`;
  }
  if (numberPart.length > 5) {
    result += `-${numberPart.slice(5, 7)}`;
  }
  if (numberPart.length > 7) {
    result += `-${numberPart.slice(7, 9)}`;
  }
  
  return numberPart.length === 0 ? value : result;
}

import { PromocodesService } from '../promocodes/promocodes.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templatesService: TemplatesService,
    private readonly promocodesService: PromocodesService,
    @InjectQueue('video-rendering')
    private readonly videoRenderingQueue: Queue,
  ) {}

  async create(templateId: number, userData: any, user: any, promocodeCode?: string): Promise<any> {
    const template = await this.templatesService.findOne(templateId);
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    const basePrice = template.discount_price !== null && template.discount_price !== undefined
      ? Number(template.discount_price)
      : Number(template.price);

    let finalPrice = basePrice;
    let discountAmount = 0;
    let promocodeId: number | null = null;

    if (promocodeCode && promocodeCode.trim()) {
      try {
        const promoResult = await this.promocodesService.validate(promocodeCode, basePrice);
        if (promoResult.valid) {
          discountAmount = promoResult.discountAmount;
          finalPrice = promoResult.finalPrice;
          promocodeId = promoResult.promocodeId;
        }
      } catch (err) {
        // If promo code invalid, ignore or continue with base price
      }
    }

    // Enforce Click minimum payment threshold (1000 SUM if > 0)
    if (finalPrice > 0 && finalPrice < 1000) {
      finalPrice = 1000;
    }

    // If 0 SUM (100% discount or free), auto mark order status as paid
    const initialStatus = finalPrice === 0 ? 'paid' : 'processing';

    let validUserId: number | null = null;
    if (user && user.id && !isNaN(Number(user.id))) {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: Number(user.id) },
      });
      if (existingUser) {
        validUserId = existingUser.id;
      }
    }


    // 1. Create order record in Database
    let savedOrder: any = await this.prisma.order.create({
      data: {
        templateId: templateId,
        user_data: userData,
        status: initialStatus,
        total_price: finalPrice,
        original_price: basePrice,
        discount_amount: discountAmount,
        userId: validUserId,
        promocodeId: promocodeId,
      },
      include: {
        template: true,
        user: true,
        promocode: true,
      },
    });

    if (finalPrice === 0 && promocodeId) {
      await this.promocodesService.incrementUses(promocodeId);
    }

    // 2. Perform rendering based on template type
    if (template.type === 'website') {
      // Website template (immediate, no rendering needed)
      savedOrder = await this.prisma.order.update({
        where: { id: savedOrder.id },
        data: {
          status: 'completed',
          final_asset_url: `/invite/${savedOrder.id}`,
        },
        include: {
          template: true,
          user: true,
        },
      });
    } else if (template.type === 'virtual' || template.type === 'physical') {
      // Photo template rendering (immediate)
      try {
        savedOrder = await this.renderImageOrder(savedOrder);
      } catch (error) {
        console.error('Error rendering image order:', error);
        await this.prisma.order.update({
          where: { id: savedOrder.id },
          data: { status: 'failed' },
        });
        throw new BadRequestException('Failed to render invitation template');
      }
    } else {
      // Video template rendering (queued)
      savedOrder = await this.prisma.order.update({
        where: { id: savedOrder.id },
        data: { status: 'pending' },
        include: {
          template: true,
          user: true,
        },
      });
      
      try {
        await this.videoRenderingQueue.add('render', { orderId: savedOrder.id });
      } catch (queueError) {
        console.error('Error adding to video queue:', queueError);
        await this.prisma.order.update({
          where: { id: savedOrder.id },
          data: { status: 'failed' },
        });
        throw new BadRequestException('Failed to queue video rendering task');
      }
    }

    return savedOrder;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        template: true,
        user: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        template: true,
        user: true,
      },
    });
  }

  async findByUser(userId: number, claimOrderIds?: string[]): Promise<Order[]> {
    // Claim only orphaned orders explicitly remembered by this browser.
    // Never attach every anonymous order or reassign another user's order.
    if (claimOrderIds && claimOrderIds.length > 0) {
      await this.prisma.order.updateMany({
        where: {
          id: { in: claimOrderIds },
          userId: null,
        },
        data: { userId: userId },
      });
    }

    return this.prisma.order.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        template: true,
        user: true,
      },
    });
  }

  private async renderImageOrder(order: any): Promise<Order> {
    const template = order.template;
    const config = template.text_config;
    const dimensions = config.dimensions;

    // Load base template image
    const baseImagePath = join(process.cwd(), template.media_url);
    if (!fs.existsSync(baseImagePath)) {
      throw new Error(`Base template file not found at ${baseImagePath}`);
    }

    // Generate SVG text overlay
    const svgOverlay = this.generateSvgOverlay(dimensions, config.fields, order.user_data);

    // Output path in uploads/orders/
    const outputFilename = `order_${order.id}.png`;
    const outputPath = join(process.cwd(), 'uploads', 'orders', outputFilename);

    // Ensure orders directory exists
    const ordersDir = join(process.cwd(), 'uploads', 'orders');
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true });
    }

    // Compositing the SVG over the template image using Sharp
    await sharp(baseImagePath)
      .resize(dimensions.width, dimensions.height)
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0,
        },
      ])
      .toFile(outputPath);

    // Update order status in DB
    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'completed',
        final_asset_url: `/uploads/orders/${outputFilename}`,
      },
      include: {
        template: true,
        user: true,
      },
    });
  }

  private generateSvgOverlay(dimensions: { width: number; height: number }, fields: any[], userData: any): string {
    const { width, height } = dimensions;

    let textElements = '';
    for (const field of fields) {
      let value = userData[field.id] || field.placeholder || '';
      if (field.id === 'phone') {
        value = formatPhoneNumber(value);
      }
      const x = field.x;
      const y = field.y;
      const fontSize = field.fontSize;
      
      let fontFamily = field.fontFamily || 'sans-serif';
      if (fontFamily.includes('Playfair Display')) {
        fontFamily = "'Playfair Display', Georgia, serif";
      } else if (fontFamily.includes('Montserrat')) {
        fontFamily = "'Montserrat', Arial, sans-serif";
      }

      const fill = field.color || '#000000';
      let textAnchor = 'middle';
      if (field.align === 'left') textAnchor = 'start';
      if (field.align === 'right') textAnchor = 'end';

      const escapedValue = this.escapeXml(value);

      textElements += `
        <text 
          x="${x}" 
          y="${y}" 
          font-family="${fontFamily}" 
          font-size="${fontSize}" 
          fill="${fill}" 
          text-anchor="${textAnchor}"
          dominant-baseline="middle"
        >
          ${escapedValue}
        </text>
      `;
    }

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&amp;family=Playfair+Display:ital,wght@0,400..900;1,400..900&amp;display=swap');
          text {
            font-weight: 500;
          }
        </style>
        ${textElements}
      </svg>
    `;
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  async addRsvp(
    orderId: string,
    rsvpData: { name: string; attending: boolean; guestCount?: number; wishes: string },
  ): Promise<Order> {
    const name = String(rsvpData.name || '').trim();
    if (!name || typeof rsvpData.attending !== 'boolean') {
      throw new BadRequestException('Guest name and attendance status are required');
    }

    const order = await this.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const currentData = (order.user_data as any) || {};
    const rsvps = [...(currentData.rsvps || [])];
    rsvps.push({
      name,
      attending: rsvpData.attending,
      guestCount: rsvpData.attending
        ? Math.min(20, Math.max(1, Number(rsvpData.guestCount) || 1))
        : 0,
      wishes: String(rsvpData.wishes || '').trim(),
      createdAt: new Date().toISOString(),
    });

    const updatedUserData = {
      ...currentData,
      rsvps,
    };

    return this.prisma.order.update({
      where: { id: orderId },
      data: { user_data: updatedUserData },
      include: {
        template: true,
        user: true,
      },
    });
  }
}
