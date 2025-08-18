import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class RedirectOriginalUrlRequest {
  @ApiProperty({
    description: '7자리 문자열로된 단축 URL키',
    example: '0ASDFX3',
  })
  @IsNotEmpty()
  @Length(7, 7, { message: '7자리 문자열입니다.' })
  readonly shortestUrlKey: string;
}
