import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TemplatesModule } from '../templates/templates.module';
import { PromocodesModule } from '../promocodes/promocodes.module';
import { VideoRenderingProcessor } from './orders.processor';

@Module({
  imports: [
    TemplatesModule,
    PromocodesModule,
    BullModule.registerQueue({
      name: 'video-rendering',
    }),
  ],
  providers: [OrdersService, VideoRenderingProcessor],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
