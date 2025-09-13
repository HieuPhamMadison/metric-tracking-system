import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetMetricDto {
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  type: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    default: 'c1585641-b609-4252-9775-398355684774',
  })
  userId: string;
}

export class GetChartDto extends GetMetricDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    required: true,
    type: String,
    default: '2024-04-13T07:29:28.878Z',
  })
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    required: true,
    type: String,
    default: '2024-04-13T07:29:28.878Z',
  })
  endDate: string;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    default: 1,
  })
  toUnitId: number;
}
