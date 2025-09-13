import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetricDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    required: true,
    type: String,
    default: '2024-04-13T07:29:28.878Z',
  })
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    default: 10,
  })
  value: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    default: 10,
  })
  unitId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    default: 'c1585641-b609-4252-9775-398355684774',
  })
  userId: string;
}
