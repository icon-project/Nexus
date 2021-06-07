const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

let dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: process.env.LOGGER_FILENAME,
  datePattern: 'YYYYMMDD'
});

let logger = createLogger({
  level: process.env.LOGGER_LEVEL,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [dailyRotateFileTransport]
});

// Using printf() instead of simple() to remove unnecessary timestamp field in console.
if ('development' === process.env.NODE_ENV) {
  logger.add(new transports.Console({
    format: format.printf(info => {
      return info.stack ? `${info.level}: ${info.message} ${info.stack}`
        : `${info.level}: ${info.message}`;
    })
  }));
}

module.exports = logger;
