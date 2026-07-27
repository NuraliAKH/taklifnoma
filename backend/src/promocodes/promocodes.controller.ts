import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { PromocodesService, CreatePromocodeDto } from './promocodes.service';

@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Post('validate')
  async validate(@Body() body: { code: string; orderAmount?: number }) {
    return this.promocodesService.validate(body.code, body.orderAmount || 0);
  }

  @Get()
  async findAll() {
    return this.promocodesService.findAll();
  }

  @Post()
  async create(@Body() dto: CreatePromocodeDto) {
    return this.promocodesService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreatePromocodeDto>,
  ) {
    return this.promocodesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.promocodesService.remove(id);
  }
}
