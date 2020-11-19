const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const { errorHandler } = require('../../../src/utils/error');
const AppError = require('../../../src/utils/AppError');
const config = require('../../../src/config/config');
const logger = require('../../../src/config/logger');

describe('Error middlewares', () => {
  describe('Error handler', () => {
    beforeEach(() => {
      jest.spyOn(logger, 'error').mockImplementation(() => {});
    });

    test('should put the error stack in the response if in development mode', () => {
      config.env = 'development';
      const error = new AppError(httpStatus.BAD_REQUEST, 'Any error');
      const res = httpMocks.createResponse();
      const spy = jest.spyOn(res, 'json');

      errorHandler(error, httpMocks.createRequest(), res);
      // console.log(isSending);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: error.statusCode,
          message: error.message,
          stack: error.stack,
        }),
      );
      config.env = process.env.NODE_ENV;
      spy.mockRestore();
    });

    test('should send internal server error status and message if in production mode and error is not operational', () => {
      config.env = 'production';
      const error = new AppError(httpStatus.BAD_REQUEST, 'Any error', false);
      const res = httpMocks.createResponse();
      const spy = jest.spyOn(res, 'json');

      errorHandler(error, httpMocks.createRequest(), res);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: httpStatus.INTERNAL_SERVER_ERROR,
          message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
        }),
      );

      config.env = process.env.NODE_ENV;
      spy.mockRestore();
    });

    test('should preserve original error status and message if in production mode and error is operational', () => {
      config.env = 'production';
      const error = new AppError(httpStatus.BAD_REQUEST, 'Any error');
      const res = httpMocks.createResponse();
      const spy = jest.spyOn(res, 'json');

      errorHandler(error, httpMocks.createRequest(), res);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: error.statusCode,
          message: error.message,
        }),
      );
      config.env = process.env.NODE_ENV;
      spy.mockRestore();
    });
  });
});
