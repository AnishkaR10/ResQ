import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@Body() createReportDto: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createReportDto.photoUrl = `/uploads/${file.filename}`;
    }
    
    // Convert string numbers to actual numbers
    if (createReportDto.latitude) {
      createReportDto.latitude = parseFloat(createReportDto.latitude);
    }
    if (createReportDto.longitude) {
      createReportDto.longitude = parseFloat(createReportDto.longitude);
    }

    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  // Admin routes
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/all')
  findAllForAdmin() {
    return this.reportsService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/stats')
  getStats() {
    return this.reportsService.getStats();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: 'PENDING' | 'VERIFIED' | 'REJECTED' }) {
    return this.reportsService.updateStatus(id, body.status);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }
}