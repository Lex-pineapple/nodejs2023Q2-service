import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const file = fs.readFileSync(path.join(__dirname, '../doc/api.yaml'), 'utf8');

  const docFile = yaml.load(file);
  SwaggerModule.setup('doc', app, docFile as OpenAPIObject);
  await app.listen(4000);
}
bootstrap();
