const winston = require('winston');
const config = require('config');

const logger = winston.createLogger({
  level: config.get('app.logger.level'),
  format: winston.format.json(),
  defaultMeta: {
    service: 'core-service',
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/application.log' }),
  ],
});

module.exports = logger;
