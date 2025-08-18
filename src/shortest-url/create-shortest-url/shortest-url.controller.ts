import { Body, Controller, Get, HttpStatus, Param, Post, Redirect, UseInterceptors, } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { generateErrorExample } from '../../common/swagger/swagger';
import { ResponseValidationInterceptor } from '../../common/validation/response-validation';
import { CreateShortestUrlCommand } from '../port/in/create-shortest-url-command';
import { CreateShortestUrlUseCase } from '../port/in/create-shortest-url.use-case';
import { GetOriginalUrlQuery } from '../port/in/get-original-url.query';
import { GetOriginalUrlUseCase } from '../port/in/get-original-url.use-case';
import { CreateShortestUrlRequestBody } from './create-shortest-url.request';
import { CreateShortestUrlResponse } from './create-shortest-url.response';

@ApiTags('Shortest URL API')
@Controller()
export class ShortestUrlController {
  constructor(
    private readonly createShortestUrlUseCase: CreateShortestUrlUseCase,
    private readonly getOriginalUrlUseCase: GetOriginalUrlUseCase,
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
  @Post('shortest-urls')
  @UseInterceptors(new ResponseValidationInterceptor(CreateShortestUrlResponse))
  async createShortestUrl(
    @Body() body: CreateShortestUrlRequestBody,
  ): Promise<CreateShortestUrlResponse> {
    const command = CreateShortestUrlCommand.builder()
      .set('originalUrl', body.originalUrl)
      .build();
    return this.createShortestUrlUseCase.execute(command);
  }

  @ApiOperation({
    summary: '원본 URL 리다이렉트 API',
    description: '단축된 URL을 원본으로 되돌립니다.',
  })
  @ApiFoundResponse({ description: 'Sucess' })
  @ApiBadRequestResponse({
    description: 'param 오류',
    content: {
      'application/json': {
        example: {
          '원본 URL': {
            value: generateErrorExample(
              HttpStatus.BAD_REQUEST,
              '/:shortestUrlKey',
              '7자리 문자열 입니다.',
            ),
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '존재 하지 않음',
    content: {
      'application/json': {
        example: {
          '단축 URL': {
            value: generateErrorExample(
              HttpStatus.NOT_FOUND,
              '/:shortestUrlKey',
              '등록되어있는 단축 URL이 아닙니다.',
            ),
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '서버 오류',
    content: {
      'application/json': {
        example: generateErrorExample(
          HttpStatus.INTERNAL_SERVER_ERROR,
          '/:shortestUrlKey',
          '서버오류입니다. 잠시후 다시 해주세요',
        ),
      },
    },
  })
  @Get(':shortestUrlKey')
  @Redirect()
  async redirectOriginalUrl(@Param() path: RedirectOriginalUrlRequestPath) {
    const query = GetOriginalUrlQuery.builder()
      .set('shortestUrlKey', path.shortestUrlKey)
      .build();

    const originalUrl = await this.getOriginalUrlUseCase.execute(query);
    return { url: originalUrl };
  }
}
