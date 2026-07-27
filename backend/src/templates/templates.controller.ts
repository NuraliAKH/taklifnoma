import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  NotFoundException, 
  ParseIntPipe, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname, join } from 'path';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { TemplatesService } from './templates.service';
import { Template } from './entities/template.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async findAll(): Promise<Template[]> {
    return this.templatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Template> {
    const template = await this.templatesService.findOne(id);
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() templateData: Partial<Template>): Promise<Template> {
    return this.templatesService.create(templateData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() templateData: Partial<Template>,
  ): Promise<Template> {
    try {
      return await this.templatesService.update(id, templateData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.templatesService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/templates',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: any, @Body('convertToVideo') convertToVideo?: string) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    const shouldConvertToVideo = convertToVideo === 'true';
    const isImage = file.mimetype?.startsWith('image/');

    if (shouldConvertToVideo && isImage) {
      const localFfmpegPath = 'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe';
      if (fs.existsSync(localFfmpegPath)) {
        ffmpeg.setFfmpegPath(localFfmpegPath);
      }

      const inputPath = file.path;
      const outputFilename = `${basename(file.filename, extname(file.filename))}.mp4`;
      const outputPath = join(file.destination, outputFilename);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .inputOptions(['-loop 1'])
          .duration(8)
          .videoFilters('scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p')
          .outputOptions(['-movflags +faststart'])
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', reject)
          .run();
      });

      fs.unlinkSync(inputPath);
      return { url: `/uploads/templates/${outputFilename}` };
    }

    return { url: `/uploads/templates/${file.filename}` };
  }
}
