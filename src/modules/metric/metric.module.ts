import { Module } from '@nestjs/common';
import { MetricService } from './services/metric.service';
import { MetricController } from './controllers/metric.controller';

@Module({
  providers: [MetricService],
  controllers: [MetricController],
})
export class MetricModule {}
