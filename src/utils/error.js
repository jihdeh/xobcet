const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const AppError = require('./AppError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new AppError(statusCode, message, false, err.stack);
  }
  next(error);
};

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
  errorConverter,
  errorHandler,
};
