import { Body, Controller, HttpStatus, Post, UseInterceptors, } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { generateErrorExample } from '../../common/swagger/swagger';
import { ResponseValidationInterceptor } from '../../common/validation/response-validation';
import { CreateShortestUrlCommand } from '../port/in/create-shortest-url-command';
import { CreateShortestUrlUseCase } from '../port/in/create-shortest-url.use-case';
import { CreateShortestUrlRequestBody } from './create-shortest-url.request';
import { CreateShortestUrlResponse } from './create-shortest-url.response';

@ApiTags('Shortest URL API')
@Controller('shortest-url')
export class ShortestUrlController {
  constructor(
    private readonly createShortestUrlUseCase: CreateShortestUrlUseCase,
  ) {}

  @ApiOperation({
    summary: 'Create shortest url',
    description: '원본 URL로 부터 단축 URL을 만듭니다.',
  })
  @ApiCreatedResponse({ description: '성공', type: CreateShortestUrlResponse })
  @ApiBadRequestResponse({
    description: 'param 오류',
    content: {
      'application/json': {
        examples: {
          '원본 URL': {
            value: generateErrorExample(
              HttpStatus.BAD_REQUEST,
              'api/shortest-urls',
              '올바른 URL을 입력하세요!',
            ),
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '서버오류',
    content: {
      'application/json': {
        example: generateErrorExample(
          HttpStatus.INTERNAL_SERVER_ERROR,
          '/api/shortest-urls',
          '서버 오류 입니다. 잠시후 다시 시도해두세요!',
        ),
      },
    },
  })
  @Post()
  @UseInterceptors(new ResponseValidationInterceptor(CreateShortestUrlResponse))
  async createShortestUrl(
    @Body() body: CreateShortestUrlRequestBody,
  ): Promise<CreateShortestUrlResponse> {
    const command = CreateShortestUrlCommand.builder()
      .set('originalUrl', body.originalUrl)
      .build();
    return this.createShortestUrlUseCase.execute(command);
  }
}
