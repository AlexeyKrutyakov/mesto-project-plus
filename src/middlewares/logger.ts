import winston from 'winston';
import expressWinston from 'express-winston';

export default expressWinston.logger({
  transports: [
    // new winston.transports.Console({
    //   format: winston.format.simple(),
    // }), // console
    new winston.transports.File({
      filename: '../request.log',
    }),
  ],
  format: winston.format.json(),
});
