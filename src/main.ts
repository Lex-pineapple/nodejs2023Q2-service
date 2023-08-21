import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from 'src/log/log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });

  const logger = app.get(LoggingService);
  app.useLogger(logger);
  process.on('uncaughtException', (err, origin) => {
    logger.error(`Caught Exception - ${err.message}`);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason, promise) => {
    logger.warn(`Rejection at promise - ${reason}`);
  });

  const file = fs.readFileSync(path.join(__dirname, '../doc/api.yaml'), 'utf8');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const docFile = yaml.load(file);
  SwaggerModule.setup('doc', app, docFile as OpenAPIObject);
  await app.listen(port || 4000);
}
bootstrap();
