import {
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

@Controller(['webhook', 'api/webhook'])
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly configService: ConfigService) {}

  @Post('deploy')
  @HttpCode(HttpStatus.ACCEPTED)
  deploy(
    @Req() request: RawBodyRequest<Request>,
    @Headers('x-hub-signature-256') signature?: string,
    @Headers('x-github-event') event?: string,
    @Headers('x-github-delivery') deliveryId?: string,
  ) {
    const secret = this.configService.get<string>('GITHUB_WEBHOOK_SECRET');
    if (!secret) {
      this.logger.error('GITHUB_WEBHOOK_SECRET is not configured');
      throw new HttpException(
        'Webhook is not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (
      !request.rawBody ||
      !this.hasValidSignature(request.rawBody, signature, secret)
    ) {
      throw new HttpException(
        'Invalid webhook signature',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (event === 'ping') {
      return { accepted: true, message: 'pong' };
    }

    const payload = request.body as { ref?: string };
    if (event !== 'push' || payload.ref !== 'refs/heads/main') {
      return { accepted: true, message: 'Event ignored' };
    }

    const scriptPath = this.configService.get<string>(
      'DEPLOY_SCRIPT_PATH',
      '/home/nurali/www/taklifnoma/deploy.sh',
    );

    if (!existsSync(scriptPath)) {
      this.logger.error(`Deploy script not found: ${scriptPath}`);
      throw new HttpException(
        'Deploy script not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const child = spawn('/bin/bash', [scriptPath], {
      detached: true,
      stdio: 'ignore',
      env: process.env,
    });
    child.on('error', (error) => {
      this.logger.error(`Failed to start deploy script: ${error.message}`);
    });
    child.unref();

    this.logger.log(
      `Deploy accepted; GitHub delivery: ${deliveryId || 'unknown'}`,
    );
    return { accepted: true, message: 'Deploy started' };
  }

  private hasValidSignature(
    rawBody: Buffer,
    signature: string | undefined,
    secret: string,
  ) {
    if (!signature?.startsWith('sha256=')) return false;

    const expected = Buffer.from(
      `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`,
    );
    const received = Buffer.from(signature);

    return (
      expected.length === received.length && timingSafeEqual(expected, received)
    );
  }
}
