import { Module } from '@nestjs/common';
import { ConfigsModule } from './config/config.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [ConfigsModule, PrismaModule],
})
export class CoreModule {}
