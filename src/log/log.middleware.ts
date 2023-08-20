import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from 'src/log/log.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const message = `${req.method} - URL {${
        req.originalUrl
      }} - Body:${JSON.stringify(req.body)} - Query:${JSON.stringify(
        req.query,
      )}`;
      const statusMessage = res.statusMessage;
      const statusCode = res.statusCode;
      this.logger.log(message);
      if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(`${statusCode} ${statusMessage}`);
      } else if (statusCode >= 500) {
        this.logger.error(`${statusCode} ${statusMessage}`);
      } else {
        this.logger.log(`${statusCode} ${statusMessage}`);
      }
    });
    next();
  }
}
