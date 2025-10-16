import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { ClsServiceManager } from 'nestjs-cls';
import * as DailyRotateFile from 'winston-daily-rotate-file';
const cls = ClsServiceManager.getClsService();

const addMetadata = winston.format(info => {
  info.requestId = cls.get('requestId');
  info.sessionId = cls.get('sessionId');
  return info;
});

const httpRotateTransport = new DailyRotateFile({
  filename: 'logs/http-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format(info => {
      if (info.context === 'HTTP') return info;
      else return false;
    })(),
    winston.format.json(),
  ),
});

const errorRotateTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: winston.format.combine(winston.format.json()),
});

export const winstonConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    addMetadata(),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  handleExceptions: true,
  handleRejections: true,
  exitOnError: false,
  transports: [
    errorRotateTransport,
    httpRotateTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        nestWinstonModuleUtilities.format.nestLike('NestWinston', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
};
