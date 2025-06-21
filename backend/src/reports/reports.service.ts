import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: any) {
    return this.prisma.report.create({
      data: {
        ...createReportDto,
        status: 'PENDING', // Default status
      },
    });
  }

  async findAll() {
    // Only return verified reports for public view
    return this.prisma.report.findMany({
      where: {
        status: 'VERIFIED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllForAdmin() {
    // Return all reports for admin view
    return this.prisma.report.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.report.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: 'PENDING' | 'VERIFIED' | 'REJECTED') {
    return this.prisma.report.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.report.delete({
      where: { id },
    });
  }

  async getStats() {
    const total = await this.prisma.report.count();
    const verified = await this.prisma.report.count({
      where: { status: 'VERIFIED' },
    });
    const pending = await this.prisma.report.count({
      where: { status: 'PENDING' },
    });
    const rejected = await this.prisma.report.count({
      where: { status: 'REJECTED' },
    });

    return {
      total,
      verified,
      pending,
      rejected,
    };
  }
}