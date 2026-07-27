import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TemplatesModule } from '../templates/templates.module';
import { VideoRenderingProcessor } from './orders.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TemplatesModule,
    BullModule.registerQueue({
      name: 'video-rendering',
    }),
  ],
  providers: [OrdersService, VideoRenderingProcessor],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}

