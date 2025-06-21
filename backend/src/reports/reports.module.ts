import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // <-- Import both modules here
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
