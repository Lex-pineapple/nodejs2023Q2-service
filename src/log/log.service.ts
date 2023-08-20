import { Injectable, LoggerService } from '@nestjs/common';
import { appendFileSync, statSync } from 'fs';
import * as path from 'path';
import * as fs from 'fs';

const logLevels = {
  0: 'error',
  1: 'warn',
  2: 'log',
  3: 'debug',
  4: 'verbose',
};

@Injectable()
export class LoggingService implements LoggerService {
  level: number;

  constructor() {
    this.level = parseInt(process.env.LOG_LEVEL) || 2;
  }

  log(message: any, ...optionalParams: any[]) {
    return this.changeLevelAndWrite(2, message);
    // appendFileSync(filename, message);
  }

  error(message: any, ...optionalParams: any[]) {
    return this.changeLevelAndWrite(0, message);
  }

  warn(message: any, ...optionalParams: any[]) {
    return this.changeLevelAndWrite(1, message);
  }

  debug(message: any, ...optionalParams: any[]) {
    return this.changeLevelAndWrite(3, message);
  }

  verbose(message: any, ...optionalParams: any[]) {
    return this.changeLevelAndWrite(4, message);
  }

  changeLevelAndWrite(level: number, message: any) {
    if (level > this.level) return false;
    const logMessage = `${
      logLevels[level]
    }: ${new Date().toISOString()} - ${message}`;
    process.stdout.write(logMessage);
    const pathToFolder = path.join(__dirname, 'logs');
    if (!fs.existsSync(pathToFolder))
      fs.mkdirSync(pathToFolder, { recursive: true });
    const filename = path.resolve(__dirname, 'logs', 'temp.log');
    try {
      const stats = fs.statSync(filename);
      const sizeInBytes = stats.size;

      if (sizeInBytes >= (parseInt(process.env.LOG_SIZE) || 10) * 1000) {
        fs.renameSync(
          filename,
          path.resolve(__dirname, 'logs', `log-${Date.now()}.log`),
        );
      }
    } catch (error) {
      console.error(error);
    }
    appendFileSync(filename, logMessage + '\n');
    return true;
  }
}
