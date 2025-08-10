import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setUpSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('ShotestURL Service')
    .setDescription(
      `URL 을 단축 해주는 서비스 ${
        process.env.NODE_ENV == Environment.Prodictio
          ? 'Development'
          : 'Production'
      } API 문서 입니다.`,
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};

export const generateErrorExample = (
  statusCode: HttpStatus,
  path: string,
  message: string,
) => ({ statusCode, timestamp: '0000-00-00T00:00:00.000Z', path, message });
