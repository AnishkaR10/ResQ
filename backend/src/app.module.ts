import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';// ✅ Make sure this path is correct

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Static file serving for image uploads
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Application feature modules
    PrismaModule,
    ReportsModule,
    AuthModule,
  ],
})
export class AppModule {}
