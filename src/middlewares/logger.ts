import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  filename: 'requests-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 10,
  zippedArchive: true,
});

export default expressWinston.logger({
  transports: [transport],
  format: winston.format.json(),
});
