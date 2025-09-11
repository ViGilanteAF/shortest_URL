import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetShortestUrlsQuery {
  @ApiProperty({
    description: '페이지',
    example: 1,
  })
  @Transform((object) => parseInt(object.value))
  @IsInt({ message: '숫자를 입력하세요!' })
  @Min(1, { message: '숫자를 입력하세요!' })
  readonly pageNumber: number;

  @ApiProperty({ description: '페이지 네이션', example: 10, default: 10 })
  @IsOptional()
  @Transform((object) => parseInt(object.value))
  @IsInt({ message: '숫자를 입력하세요!' })
  @Min(1, { message: '숫자를 입력하세요!' })
  readonly pageSize: number = 10;
}
