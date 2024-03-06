import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const requestLogsTransport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'requests-%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 10,
  zippedArchive: true,
});

const errorLogsTransport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'errors-%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 10,
  zippedArchive: true,
});

export const requestsLogger = expressWinston.logger({
  transports: [requestLogsTransport],
});

export const errorsLogger = expressWinston.logger({
  transports: [errorLogsTransport],
});
