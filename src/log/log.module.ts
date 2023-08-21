import { Module } from '@nestjs/common';
import { LoggingService } from 'src/log/log.service';

@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
