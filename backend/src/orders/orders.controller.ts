import { Controller, Post, Get, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @Body('templateId') templateId: number,
    @Body('formData') formData: any,
    @Body('promocode') promocode: string,
    @Request() req: any,
  ): Promise<Order> {
    return this.ordersService.create(templateId, formData, req.user, promocode);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyOrders(@Request() req: any): Promise<Order[]> {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Post(':id/rsvp')
  async addRsvp(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('name') name: string,
    @Body('attending') attending: boolean,
    @Body('wishes') wishes: string,
  ): Promise<Order> {
    return this.ordersService.addRsvp(id, { name, attending, wishes });
  }

  // Admin orders listing
  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}

