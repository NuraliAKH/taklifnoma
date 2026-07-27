import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { Order } from './entities/order.entity';
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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly templatesService: TemplatesService,
    @InjectQueue('video-rendering')
    private readonly videoRenderingQueue: Queue,
  ) {}

  async create(templateId: number, userData: any, user: any): Promise<Order> {
    const template = await this.templatesService.findOne(templateId);
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    // 1. Create order record in Database
    const order = this.orderRepository.create({
      template,
      user_data: userData,
      status: 'processing',
      total_price: template.discount_price !== null && template.discount_price !== undefined
        ? Number(template.discount_price)
        : Number(template.price),
      user: { id: user.id } as any, // Link order to creator
    });

    const savedOrder = await this.orderRepository.save(order);

    // 2. Perform rendering based on template type
    if (template.type === 'website' as any) {
      // Website template (immediate, no rendering needed)
      savedOrder.status = 'completed';
      savedOrder.final_asset_url = `/invite/${savedOrder.id}`;
      await this.orderRepository.save(savedOrder);
    } else if (template.type === 'virtual' || template.type === 'physical') {
      // Photo template rendering (immediate)
      try {
        await this.renderImageOrder(savedOrder);
      } catch (error) {
        console.error('Error rendering image order:', error);
        savedOrder.status = 'failed';
        await this.orderRepository.save(savedOrder);
        throw new BadRequestException('Failed to render invitation template');
      }
    } else {
      // Video template rendering (queued)
      savedOrder.status = 'pending'; // Set to pending, to be processed by BullMQ
      await this.orderRepository.save(savedOrder);
      
      try {
        await this.videoRenderingQueue.add('render', { orderId: savedOrder.id });
      } catch (queueError) {
        console.error('Error adding to video queue:', queueError);
        savedOrder.status = 'failed';
        await this.orderRepository.save(savedOrder);
        throw new BadRequestException('Failed to queue video rendering task');
      }
    }

    return savedOrder;
  }


  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }


  private async renderImageOrder(order: Order): Promise<void> {
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
    order.status = 'completed';
    order.final_asset_url = `/uploads/orders/${outputFilename}`;
    await this.orderRepository.save(order);
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
      
      // Fallback font families standard to OS to prevent blank rendering
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

      // Multi-line text fallback is not fully supported in standard SVG <text>,
      // but simple single line positioning using x and y works great for invitations.
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

  async addRsvp(orderId: string, rsvpData: { name: string; attending: boolean; wishes: string }): Promise<Order> {
    const order = await this.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!order.user_data) {
      order.user_data = {};
    }
    if (!order.user_data.rsvps) {
      order.user_data.rsvps = [];
    }

    // Force clone to ensure TypeORM detects change in jsonb column
    const rsvps = [...order.user_data.rsvps];
    rsvps.push({
      name: rsvpData.name,
      attending: rsvpData.attending,
      wishes: rsvpData.wishes,
      createdAt: new Date().toISOString(),
    });

    order.user_data = {
      ...order.user_data,
      rsvps,
    };

    return this.orderRepository.save(order);
  }
}
