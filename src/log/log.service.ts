import { Injectable, LoggerService } from '@nestjs/common';
import { appendFileSync } from 'fs';
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

  log(message: any, ..._optionalParams: any[]) {
    return this.changeLevelAndWrite(2, message);
  }

  error(message: any, ..._optionalParams: any[]) {
    return this.changeLevelAndWrite(0, message);
  }

  warn(message: any, ..._optionalParams: any[]) {
    return this.changeLevelAndWrite(1, message);
  }

  debug(message: any, ..._optionalParams: any[]) {
    return this.changeLevelAndWrite(3, message);
  }

  verbose(message: any, ..._optionalParams: any[]) {
    return this.changeLevelAndWrite(4, message);
  }

  changeLevelAndWrite(level: number, message: any) {
    if (level > this.level) return false;
    const logMessage = `${
      logLevels[level]
    }: ${new Date().toISOString()} - ${message}`;
    process.stdout.write(logMessage);
    const pathToFolder = path.join(__dirname, '..', '..', '..', 'logs');
    if (!fs.existsSync(pathToFolder))
      fs.mkdirSync(pathToFolder, { recursive: true });
    const logFilename = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'logs',
      'temp.log',
    );
    let errorLogFilename;
    if (logLevels[level] === 'error') {
      errorLogFilename = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'logs',
        'error-temp.log',
      );
    }

    try {
      const stats = fs.statSync(logFilename);
      const sizeInBytes = stats.size;
      if (errorLogFilename) {
        const errorLogStats = fs.statSync(errorLogFilename);
        const errorLogSizeInBytes = errorLogStats.size;
        if (
          errorLogSizeInBytes >=
          (parseInt(process.env.LOG_SIZE) || 10) * 1000
        ) {
          fs.renameSync(
            errorLogFilename,
            path.resolve(
              __dirname,
              '..',
              '..',
              '..',
              'logs',
              `error-log-${Date.now()}.log`,
            ),
          );
        }
      }

      if (sizeInBytes >= (parseInt(process.env.LOG_SIZE) || 10) * 1000) {
        fs.renameSync(
          logFilename,
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'logs',
            `log-${Date.now()}.log`,
          ),
        );
      }
    } catch (error) {
      // console.error(error);
    }
    appendFileSync(logFilename, logMessage + '\n');
    if (errorLogFilename) appendFileSync(errorLogFilename, logMessage + '\n');
    return true;
  }
}
