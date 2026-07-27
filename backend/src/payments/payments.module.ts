import { Module } from '@nestjs/common';
import { ClickService } from './click.service';
import { ClickController } from './click.controller';

@Module({
  providers: [ClickService],
  controllers: [ClickController],
  exports: [ClickService],
})
export class PaymentsModule {}
