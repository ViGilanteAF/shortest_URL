import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsUrl,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateShortestUrlResponse {
  @ApiProperty({
    description: '7자리 문자열 단축 URL',
    example: '0A4BV33',
  })
  @Expose()
  @IsNotEmpty()
  @Length(7)
  readonly key: string;

  @ApiProperty({
    description: '원본 URL',
    example: 'https://www.naver.com',
  })
  @Expose()
  @IsUrl()
  readonly originalUrl: string;

  @ApiProperty({
    description: '생성일',
    example: '0000-00-00T00:00:00Z',
  })
  @Expose()
  @IsDate()
  readonly createdAt: Date;

  @ApiProperty({
    description: '수정일',
    example: '0000-00-00T00:00:00Z',
  })
  @Expose()
  @IsDate()
  readonly updatedAt: Date;
}

export class CreateShortestUrlsResponse {
  @ApiProperty({
    description: '단축 URL 목록',
    type: [CreateShortestUrlsResponse],
  })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CreateShortestUrlsResponse)
  readonly shortestUrls: CreateShortestUrlsResponse[];

  @ApiProperty({
    description: '단축 URL 전체 갯수',
    example: 0,
  })
  @Expose()
  @IsInt()
  @Min(0)
  readonly totalCount: number;
}
