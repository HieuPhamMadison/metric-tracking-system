import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiProperty({
    required: true,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    required: true,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take: number = 10;
}
