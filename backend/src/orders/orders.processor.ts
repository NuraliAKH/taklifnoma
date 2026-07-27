import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import * as fs from 'fs';

function formatPhoneNumber(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return value;

  let numberPart = digits;
  if (digits.startsWith('998')) {
    numberPart = digits.slice(3);
  }
  
  numberPart = numberPart.slice(0, 9);
  
  let result = '+998';
  if (numberPart.length > 0) {
    result += ` (${numberPart.slice(0, 2)}`;
  }
  if (numberPart.length > 2) {
    result += `) ${numberPart.slice(2, 5)}`;
  }
  if (numberPart.length > 5) {
    result += `-${numberPart.slice(5, 7)}`;
  }
  if (numberPart.length > 7) {
    result += `-${numberPart.slice(7, 9)}`;
  }
  
  return numberPart.length === 0 ? value : result;
}

@Processor('video-rendering')
export class VideoRenderingProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
    
    const localFfmpegPath = 'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe';
    if (fs.existsSync(localFfmpegPath)) {
      ffmpeg.setFfmpegPath(localFfmpegPath);
    }
  }

  async process(job: Job<any, any>): Promise<any> {
    const { orderId } = job.data;
    console.log(`[Queue] Starting video rendering for Order: ${orderId}`);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { template: true },
    });

    if (!order || !order.template) {
      console.error(`[Queue] Order or Template ${orderId} not found in DB`);
      return;
    }

    try {
      // 1. Update status to processing
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'processing' },
      });

      // 2. Resolve input and output paths
      const template = order.template;
      const inputPath = join(process.cwd(), template.media_url);
      if (!fs.existsSync(inputPath)) {
        throw new Error(`Input template video file not found at ${inputPath}`);
      }

      const outputFilename = `order_${order.id}.mp4`;
      const outputPath = join(process.cwd(), 'uploads', 'orders', outputFilename);

      // Ensure orders directory exists
      const ordersDir = join(process.cwd(), 'uploads', 'orders');
      if (!fs.existsSync(ordersDir)) {
        fs.mkdirSync(ordersDir, { recursive: true });
      }

      // 3. Compile FFmpeg filtergraph string for all text fields
      const textConfig = template.text_config as any;
      const fields = textConfig?.fields || [];
      const userData = (order.user_data as any) || {};

      const filters = fields.map((field: any) => {
        let textValue = userData[field.id] || field.placeholder || '';
        if (field.id === 'phone') {
          textValue = formatPhoneNumber(textValue);
        }
        
        const escapedText = textValue
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "'\\''")
          .replace(/:/g, '\\:')
          .replace(/%/g, '\\%');

        const size = field.fontSize || 32;
        const color = field.color || 'white';
        const x = field.x;
        const y = field.y;

        let xExpr = String(x);
        if (field.align === 'center') {
          xExpr = `(${x}-text_w/2)`;
        } else if (field.align === 'right') {
          xExpr = `(${x}-text_w)`;
        }

        const yExpr = `(${y}-th/2)`;

        let fontPath = 'C\\:/Windows/Fonts/arial.ttf';
        if (field.fontFamily && field.fontFamily.includes('Playfair Display')) {
          fontPath = 'C\\:/Windows/Fonts/georgia.ttf';
        }

        return `drawtext=fontfile='${fontPath}':text='${escapedText}':x=${xExpr}:y=${yExpr}:fontsize=${size}:fontcolor=${color}`;
      });

      const filterString = filters.join(',');

      // 4. Run FFmpeg command asynchronously
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .videoFilters(filterString)
          .output(outputPath)
          .audioCodec('copy')
          .on('start', (commandLine) => {
            console.log(`[FFmpeg] Spawned command: ${commandLine}`);
          })
          .on('end', () => {
            console.log(`[FFmpeg] Successfully rendered video: ${outputPath}`);
            resolve();
          })
          .on('error', (err) => {
            console.error(`[FFmpeg] Error:`, err);
            reject(err);
          })
          .run();
      });

      // 5. Update Order status to completed
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'completed',
          final_asset_url: `/uploads/orders/${outputFilename}`,
        },
      });
      console.log(`[Queue] Completed order: ${orderId}`);

    } catch (error) {
      console.error(`[Queue] Rendering failed for Order ${orderId}:`, error);
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'failed' },
      });
    }
  }
}
