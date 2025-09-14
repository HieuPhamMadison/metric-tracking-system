/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WinstonLogger } from '../../../core/logger/logger.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { CreateMetricDto } from '../dtos/create-metric.dto';
import {
  GetChartDto,
  GetMetricDto,
  GetUnitByType,
} from '../dtos/get-metric.dto';
import { MetricErrorMessage } from '../../../common/enums/error.enum';
import { PageOptionsDto } from '../../../common/pagination/page-option-dto';
import { calcSkip } from '../../../common/pagination/calc-skip';
import { PageMetaDto } from '../../../common/pagination/page-meta.dto';
import { PageDto } from '../../../common/pagination/page.dto';
import { Prisma, Unit } from '@prisma/client';
import { convertUnitValue } from '../helpers/metric.helper';

@Injectable()
export class MetricService {
  private logger = new WinstonLogger();
  constructor(private readonly prisma: PrismaService) {}

  async create(createMetricDto: CreateMetricDto) {
    try {
      const { date, value, unitId, userId } = createMetricDto;
      // check if unitId is valid
      const unit = await this.prisma.unit.findUnique({
        where: { id: unitId },
      });

      if (!unit) {
        throw new BadRequestException(MetricErrorMessage.UNIT_NOT_FOUND);
      }
      const metric = await this.prisma.metricEntry.create({
        data: {
          date,
          value,
          unitId,
          createdBy: userId,
        },
      });

      return metric;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMetricsByType(
    getMetricDto: GetMetricDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    try {
      const whereQuery: Prisma.MetricEntryWhereInput = {
        createdBy: getMetricDto.userId,
      };
      if (getMetricDto.type) {
        whereQuery.unit = {
          metricTypeId: +getMetricDto.type,
        };
      }
      const itemCount = await this.prisma.metricEntry.count({
        where: whereQuery,
      });

      const entries = await this.prisma.metricEntry.findMany({
        where: whereQuery,
        skip: calcSkip(pageOptionsDto),
        take: pageOptionsDto.take,
        include: {
          unit: {
            select: {
              name: true,
              symbol: true,
            },
          },
        },
      });

      const pageMetaDto = new PageMetaDto(pageOptionsDto, itemCount);
      return new PageDto(entries, pageMetaDto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async convertUnit(entryId: number, toUnitId: number) {
    try {
      const entry = await this.prisma.metricEntry.findUnique({
        where: { id: entryId },
      });

      if (!entry) {
        throw new BadRequestException(MetricErrorMessage.ENTRY_NOT_FOUND);
      }

      const fromUnit = await this.prisma.unit.findUnique({
        where: { id: entry.unitId },
      });

      if (!fromUnit) {
        throw new BadRequestException(MetricErrorMessage.UNIT_NOT_FOUND);
      }

      const toUnit = await this.prisma.unit.findUnique({
        where: { id: toUnitId },
      });

      if (!toUnit) {
        throw new BadRequestException(MetricErrorMessage.UNIT_NOT_FOUND);
      }

      if (fromUnit.metricTypeId !== toUnit.metricTypeId) {
        throw new BadRequestException(MetricErrorMessage.TARGET_UNIT_INVALID);
      }

      if (fromUnit.symbol === toUnit.symbol) {
        return entry.value;
      }

      const convertedValue = convertUnitValue(
        Number(entry.value),
        fromUnit,
        toUnit,
      );
      return convertedValue;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getChart(getChartDto: GetChartDto) {
    try {
      const {
        type,
        userId,
        startDate: startDateString,
        endDate: endDateString,
      } = getChartDto;
      const metricTypeId = +type;
      const toUnitId = +getChartDto.toUnitId;

      if (!type) {
        throw new BadRequestException(
          MetricErrorMessage.TYPE_SHOULD_BE_PROVIDED,
        );
      }

      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      if (startDate > endDate) {
        throw new BadRequestException(
          MetricErrorMessage.START_DATE_AFTER_END_DATE,
        );
      }

      // Step 2: Fetch all units for the given type for conversions
      const unitsForType = await this.prisma.unit.findMany({
        where: { metricTypeId },
      });

      if (unitsForType.length === 0) {
        throw new NotFoundException(MetricErrorMessage.NO_UNITS_FOUND_FOR_TYPE);
      }

      // Find the target unit (`toUnit`) specified by the user
      const toUnit = unitsForType.find((unit) => unit.id === toUnitId);

      // Validate the target unit
      if (!toUnit) {
        throw new BadRequestException(MetricErrorMessage.UNIT_NOT_FOUND);
      }

      const unitsMap = new Map<number, Unit>(
        unitsForType.map((unit) => [unit.id, unit]),
      );

      // Step 3: Use a raw query to get the latest entry for each day
      const latestEntries: {
        id: number;
        value: number;
        date: Date;
        unitId: number;
      }[] = await this.prisma.$queryRaw`
      SELECT id, value, date, "unit_id" as "unitId"
      FROM (
        SELECT
          *,
          ROW_NUMBER() OVER(PARTITION BY date_trunc('day', date) ORDER BY "created_at" DESC) as rn
        FROM "metric_entries"
        WHERE "created_by" = ${userId}
          AND date >= ${startDate}
          AND date <= ${endDate}
          AND "unit_id" IN (${Prisma.join(Array.from(unitsMap.keys()))})
      ) as subquery
      WHERE rn = 1
      ORDER BY date ASC;
    `;

      // Step 4: Convert each value to the target unit
      const chartData = latestEntries.map((entry) => {
        const fromUnit = unitsMap.get(entry.unitId);
        if (!fromUnit) {
          this.logger.warn(`Unit with id ${entry.unitId} not found in map.`);
          return null;
        }

        const convertedValue =
          fromUnit.id === toUnit.id
            ? Number(entry.value)
            : convertUnitValue(Number(entry.value), fromUnit, toUnit);

        return {
          date: entry.date,
          value: convertedValue,
          unit: toUnit.symbol,
        };
      });

      return {
        data: chartData.filter(Boolean),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUnits(getUnitByType: GetUnitByType) {
    try {
      const whereQuery: Prisma.UnitWhereInput = {};
      if (getUnitByType.type) {
        whereQuery.metricTypeId = +getUnitByType.type;
      }

      return this.prisma.unit.findMany({
        where: whereQuery,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMetricsTypes() {
    return await this.prisma.metricType.findMany();
  }
}
