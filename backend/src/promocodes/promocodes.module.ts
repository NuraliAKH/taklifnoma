import { Module, OnModuleInit } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromocodesController],
  providers: [PromocodesService],
  exports: [PromocodesService],
})
export class PromocodesModule implements OnModuleInit {
  constructor(private readonly promocodesService: PromocodesService) {}

  async onModuleInit() {
    await this.promocodesService.seedDefaultPromocodes();
  }
}
