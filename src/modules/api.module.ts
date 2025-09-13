import { Module } from '@nestjs/common';
import { MetricModule } from './metric/metric.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [MetricModule],
})
export class ApiModule {}
