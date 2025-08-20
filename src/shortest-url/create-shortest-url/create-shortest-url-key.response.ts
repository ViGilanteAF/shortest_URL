import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateShortestUrlKeyResponse {
  @ApiProperty({
    description: '7자리 문자열 단축 URL',
    example: '0A4BV33',
  })
  @Expose()
  @IsNotEmpty()
  @Length(7)
  readonly key: string;
}
