import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Redirect,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { generateErrorExample } from '../common/swagger/swagger';
import { ResponseValidationInterceptor } from '../common/validation/response-validation';
import { CreateShortestUrlKeyResponse } from './create-shortest-url/create-shortest-url-key.response';
import { CreateShortestUrlRequestBody } from './create-shortest-url/create-shortest-url.request';
import { CreateShortestUrlsResponse } from './create-shortest-url/create-shortest-urls.response';
import { RedirectOriginalUrlRequest } from './create-shortest-url/redirect-original-url.request';
import { ShortestUrl } from './domain/shortest-url';
import { CreateShortestUrlCommand } from './port/in/create-shortest-url-command';
import { CreateShortestUrlUseCase } from './port/in/create-shortest-url.use-case';
import { GetOriginalUrlUseCase } from './port/in/get-original-url.use-case';
import { GetShortestUrlsQuery } from './port/in/get-shortest-urls.query';
import { GetShortestUrlsUseCase } from './port/in/get-shortest-urls.use-case';

@ApiTags('Shortest URL API')
@Controller('shortest-urls')
export class ShortestUrlController {
  constructor(
    private readonly createShortestUrlUseCase: CreateShortestUrlUseCase,
    private readonly getOriginalUrlUseCase: GetOriginalUrlUseCase,
    private readonly getShortestUrlsUseCase: GetShortestUrlsUseCase,
  ) {}

  @ApiOperation({
    summary: 'Create shortest url',
    description: '원본 URL로 부터 단축 URL을 만듭니다.',
  })
  @ApiCreatedResponse({
    description: '성공',
    type: CreateShortestUrlKeyResponse,
  })
  @ApiBadRequestResponse({
    description: '잘못된 입력',
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
          '/shortest-urls',
          '서버 오류 입니다. 잠시후 다시 시도해두세요!',
        ),
      },
    },
  })
  @Post()
  @UseInterceptors(
    new ResponseValidationInterceptor(CreateShortestUrlKeyResponse),
  )
  async createShortestUrl(
    @Body() body: CreateShortestUrlRequestBody,
  ): Promise<CreateShortestUrlKeyResponse> {
    const command = CreateShortestUrlCommand.builder()
      .set('originalUrl', body.originalUrl)
      .build();
    return this.createShortestUrlUseCase.execute(command);
  }

  @ApiOperation({
    summary: '원본 URL 리다이렉트 API',
    description: '단축된 URL을 원본으로 되돌립니다.',
  })
  @ApiFoundResponse({ description: 'Success' })
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
  async RedirectOriginalUrlRequest(@Param() path: RedirectOriginalUrlRequest) {
    const originalUrl = await this.getOriginalUrlUseCase.execute(
      path.shortestUrlKey,
    );
    return { url: originalUrl };
  }

  @ApiOperation({
    summary: '단축 URL 목록 API',
    description: '단축된 URL들의 목록을 조회 합니다.',
  })
  @ApiOkResponse({
    description: '성공',
    type: CreateShortestUrlsResponse,
  })
  @ApiBadRequestResponse({
    description: '잘못된 입력',
    example: {
      페이지: {
        value: generateErrorExample(
          HttpStatus.BAD_REQUEST,
          ':/ShortestUrlKey',
          '숫자를 입력 하세요!',
        ),
      },
      '페이지 크기': {
        value: generateErrorExample(
          HttpStatus.BAD_REQUEST,
          ':/ShortestUrlKey',
          '숫자를 입력 하세요!',
        ),
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '서버 오류',
    content: {
      'application/json': {
        example: generateErrorExample(
          HttpStatus.INTERNAL_SERVER_ERROR,
          '/:shortest-urls',
          '서버오류입니다. 잠시후 다시 해주세요',
        ),
      },
    },
  })
  @Get()
  @UseInterceptors(
    new ResponseValidationInterceptor(CreateShortestUrlsResponse),
  )
  async getShortestUrls(
    @Query() query: GetShortestUrlsQuery,
  ): Promise<{ shortestUrls: ShortestUrl[]; totalCount: number }> {
    return this.getShortestUrlsUseCase.execute(
      query.pageNumber,
      query.pageSize,
    );
  }
}

/**
 * @ApiOkResponse({
 *     description: '성공',
 *     type: CreateShortestUrlsResponse,
 *   })
 *   @ApiBadRequestResponse({
 *     description: '잘못된 입력',
 *     example: {
 *       페이지: {
 *         value: generateErrorExample(
 *           HttpStatus.BAD_REQUEST,
 *           ':/ShortestUrlKey',
 *           '숫자를 입력 하세요!',
 *         ),
 *       },
 *       '페이지 크기': {
 *         value: generateErrorExample(
 *           HttpStatus.BAD_REQUEST,
 *           ':/ShortestUrlKey',
 *           '숫자를 입력 하세요!',
 *         ),
 *       },
 *     },
 *   })
 */
