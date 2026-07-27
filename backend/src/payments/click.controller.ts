import { Controller, Post, Get, Body, Param, NotFoundException } from '@nestjs/common';
import { ClickService, ClickPrepareDto, ClickCompleteDto } from './click.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payments/click')
export class ClickController {
  constructor(
    private readonly clickService: ClickService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('prepare')
  async prepare(@Body() body: any) {
    const dto: ClickPrepareDto = {
      click_trans_id: Number(body.click_trans_id),
      service_id: Number(body.service_id),
      click_paydoc_id: body.click_paydoc_id ? Number(body.click_paydoc_id) : undefined,
      merchant_trans_id: String(body.merchant_trans_id),
      amount: Number(body.amount),
      action: Number(body.action),
      error: Number(body.error),
      error_note: body.error_note,
      sign_time: String(body.sign_time),
      sign_string: String(body.sign_string),
    };
    return this.clickService.prepare(dto);
  }

  @Post('complete')
  async complete(@Body() body: any) {
    const dto: ClickCompleteDto = {
      click_trans_id: Number(body.click_trans_id),
      service_id: Number(body.service_id),
      click_paydoc_id: body.click_paydoc_id ? Number(body.click_paydoc_id) : undefined,
      merchant_trans_id: String(body.merchant_trans_id),
      merchant_prepare_id: Number(body.merchant_prepare_id),
      amount: Number(body.amount),
      action: Number(body.action),
      error: Number(body.error),
      error_note: body.error_note,
      sign_time: String(body.sign_time),
      sign_string: String(body.sign_string),
    };
    return this.clickService.complete(dto);
  }

  @Get('pay-links/:orderId')
  async getPayLinks(@Param('orderId') orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const amount = Number(order.total_price);
    return this.clickService.generatePaymentUrls(orderId, amount);
  }
}
