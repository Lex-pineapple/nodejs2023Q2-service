import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const file = fs.readFileSync(path.join(__dirname, '../doc/api.yaml'), 'utf8');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  const docFile = yaml.load(file);
  SwaggerModule.setup('doc', app, docFile as OpenAPIObject);
  await app.listen(port || 4000);
}
bootstrap();
