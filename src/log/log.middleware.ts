import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { LoggingService } from 'src/log/log.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('TEST_MDW_DATA');
    next();
  }
}
