import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MetricService } from '../services/metric.service';
import { CreateMetricDto } from '../dtos/create-metric.dto';
import { GetChartDto, GetMetricDto } from '../dtos/get-metric.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../../common/pagination/page-option-dto';
import { httpResponse } from '../../../common/interceptors/response';

@Controller('metrics')
@ApiTags('Metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Post()
  async create(@Body() createMetricDto: CreateMetricDto) {
    const res = await this.metricService.create(createMetricDto);
    return httpResponse({ success: true, data: res });
  }

  @Get()
  async getMetricsByType(
    @Query() getMetricDto: GetMetricDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    const data = await this.metricService.getMetricsByType(
      getMetricDto,
      pageOptionsDto,
    );

    return httpResponse({ success: true, ...data });
  }

  @Get('chart')
  getChart(@Query() getChartDto: GetChartDto) {
    return this.metricService.getChart(getChartDto);
  }

  @Get('units')
  async getUnits() {
    const res = await this.metricService.getUnits();
    return httpResponse({ success: true, data: res });
  }

  @Get('types')
  async getMetricsTypes() {
    const res = await this.metricService.getMetricsTypes();
    return httpResponse({ success: true, data: res });
  }
}
