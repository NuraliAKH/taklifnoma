import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface ClickPrepareDto {
  click_trans_id: number;
  service_id: number;
  click_paydoc_id?: number;
  merchant_trans_id: string;
  amount: number;
  action: number;
  error: number;
  error_note?: string;
  sign_time: string;
  sign_string: string;
}

export interface ClickCompleteDto extends ClickPrepareDto {
  merchant_prepare_id: number;
}

@Injectable()
export class ClickService {
  private readonly logger = new Logger(ClickService.name);
  private readonly serviceId: number;
  private readonly merchantId: number;
  private readonly secretKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.serviceId = Number(this.configService.get<string>('CLICK_SERVICE_ID', '108456'));
    this.merchantId = Number(this.configService.get<string>('CLICK_MERCHANT_ID', '63342'));
    this.secretKey = this.configService.get<string>('CLICK_SECRET_KEY', 'wVvpwyZtKL');
  }

  generateMd5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  verifyPrepareSign(dto: ClickPrepareDto): boolean {
    const raw = `${dto.click_trans_id}${dto.service_id}${this.secretKey}${dto.merchant_trans_id}${dto.amount}${dto.action}${dto.sign_time}`;
    const expected = this.generateMd5(raw);
    return expected.toLowerCase() === dto.sign_string.toLowerCase();
  }

  verifyCompleteSign(dto: ClickCompleteDto): boolean {
    const raw = `${dto.click_trans_id}${dto.service_id}${this.secretKey}${dto.merchant_trans_id}${dto.merchant_prepare_id}${dto.amount}${dto.action}${dto.sign_time}`;
    const expected = this.generateMd5(raw);
    return expected.toLowerCase() === dto.sign_string.toLowerCase();
  }

  async prepare(dto: ClickPrepareDto) {
    this.logger.log(`[Click Prepare Request] OrderId: ${dto.merchant_trans_id}, ClickTransId: ${dto.click_trans_id}, Amount: ${dto.amount}`);

    // 1. Verify Sign
    if (!this.verifyPrepareSign(dto)) {
      this.logger.warn(`[Click Prepare Error] Invalid Sign for ClickTransId: ${dto.click_trans_id}`);
      return {
        error: -1,
        error_note: 'SIGN CHECK FAILED',
      };
    }

    // 2. Check Order existence
    const order = await this.prisma.order.findUnique({
      where: { id: dto.merchant_trans_id },
    });

    if (!order) {
      this.logger.warn(`[Click Prepare Error] Order not found: ${dto.merchant_trans_id}`);
      return {
        error: -5,
        error_note: 'USER DOES NOT EXIST',
      };
    }

    // 3. Check Order Amount
    const expectedAmount = Number(order.total_price);
    const receivedAmount = Number(dto.amount);
    if (Math.abs(expectedAmount - receivedAmount) > 0.01) {
      this.logger.warn(`[Click Prepare Error] Amount mismatch. Expected: ${expectedAmount}, Received: ${receivedAmount}`);
      return {
        error: -2,
        error_note: 'INCORRECT PARAMETER AMOUNT',
      };
    }

    // 4. Check if order is already completed
    if (order.status === 'paid' || order.status === 'completed') {
      return {
        error: -4,
        error_note: 'ALREADY PAID',
      };
    }

    // 5. Create or Update Payment Transaction record in DB
    const prepareId = Math.floor(Date.now() / 1000) % 2147483647; // generate prepare ID
    
    await this.prisma.paymentTransaction.upsert({
      where: { clickTransId: BigInt(dto.click_trans_id) },
      update: {
        amount: dto.amount,
        action: dto.action,
        status: 'prepared',
        updatedAt: new Date(),
      },
      create: {
        clickTransId: BigInt(dto.click_trans_id),
        serviceId: Number(dto.service_id),
        clickPaydocId: dto.click_paydoc_id ? BigInt(dto.click_paydoc_id) : null,
        merchantTransId: dto.merchant_trans_id,
        merchantPrepareId: prepareId,
        amount: dto.amount,
        action: dto.action,
        status: 'prepared',
      },
    });

    this.logger.log(`[Click Prepare Success] Prepare ID: ${prepareId}`);
    return {
      click_trans_id: Number(dto.click_trans_id),
      merchant_trans_id: dto.merchant_trans_id,
      merchant_prepare_id: prepareId,
      error: 0,
      error_note: 'Success',
    };
  }

  async complete(dto: ClickCompleteDto) {
    this.logger.log(`[Click Complete Request] OrderId: ${dto.merchant_trans_id}, ClickTransId: ${dto.click_trans_id}`);

    // 1. Verify Sign
    if (!this.verifyCompleteSign(dto)) {
      this.logger.warn(`[Click Complete Error] Invalid Sign for ClickTransId: ${dto.click_trans_id}`);
      return {
        error: -1,
        error_note: 'SIGN CHECK FAILED',
      };
    }

    // 2. Check Order existence
    const order = await this.prisma.order.findUnique({
      where: { id: dto.merchant_trans_id },
    });

    if (!order) {
      return {
        error: -5,
        error_note: 'USER DOES NOT EXIST',
      };
    }

    // 3. Find Transaction record
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { clickTransId: BigInt(dto.click_trans_id) },
    });

    if (!transaction) {
      return {
        error: -6,
        error_note: 'TRANSACTION NOT FOUND',
      };
    }

    // 4. Idempotency Check - if already completed
    if (transaction.status === 'completed') {
      return {
        click_trans_id: Number(dto.click_trans_id),
        merchant_trans_id: dto.merchant_trans_id,
        merchant_confirm_id: dto.merchant_prepare_id,
        error: 0,
        error_note: 'Success',
      };
    }

    // 5. Check if error was passed from Click
    if (Number(dto.error) < 0) {
      await this.prisma.paymentTransaction.update({
        where: { clickTransId: BigInt(dto.click_trans_id) },
        data: {
          error: Number(dto.error),
          errorNote: dto.error_note || 'Cancelled',
          status: 'cancelled',
        },
      });

      return {
        error: Number(dto.error),
        error_note: dto.error_note || 'TRANSACTION CANCELLED',
      };
    }

    // 6. Update Transaction to completed
    await this.prisma.paymentTransaction.update({
      where: { clickTransId: BigInt(dto.click_trans_id) },
      data: {
        status: 'completed',
        error: 0,
        errorNote: 'Success',
      },
    });

    // 7. Update Order status to paid / completed
    await this.prisma.order.update({
      where: { id: dto.merchant_trans_id },
      data: {
        status: 'paid',
      },
    });

    this.logger.log(`[Click Complete Success] Order ${dto.merchant_trans_id} marked as paid`);

    return {
      click_trans_id: Number(dto.click_trans_id),
      merchant_trans_id: dto.merchant_trans_id,
      merchant_confirm_id: dto.merchant_prepare_id,
      error: 0,
      error_note: 'Success',
    };
  }

  generatePaymentUrls(orderId: string, amount: number) {
    const clickUpUrl = `https://my.click.uz/services/pay?service_id=${this.serviceId}&merchant_id=${this.merchantId}&amount=${amount}&transaction_param=${orderId}`;
    const clickCardUrl = `${clickUpUrl}&card_type=all`;
    return {
      clickUpUrl,
      clickCardUrl,
    };
  }
}
