const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');

const errorHandler = (err, req, res) => {
  let { statusCode = httpStatus.BAD_REQUEST, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.statusCode = statusCode;
  res.json(response);
};

module.exports = {
  errorHandler,
};
