import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule, {
    // 本番は警告・エラーのみ、開発は全ログ出力
    logger: isProduction
      ? ['warn', 'error']
      : ['log', 'debug', 'warn', 'error'],
  });

  // Azure App Service はリバースプロキシ経由のためプロキシを信頼
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // CORS設定
  // FRONTEND_URL は複数カンマ区切りで指定可能（例: "https://xxx.azurestaticapps.net,http://localhost:3001"）
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3001')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // グローバル例外フィルター（バリデーションエラーを含む全例外をログ出力）
  app.useGlobalFilters(new AllExceptionsFilter());

  // グローバルバリデーションパイプ
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  logger.log(`Application started on port ${port} [${isProduction ? 'production' : 'development'}]`);
}
bootstrap();
