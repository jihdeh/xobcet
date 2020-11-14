const { errorHandler } = require('./error');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    errorHandler(err, req, res);
  });
};

module.exports = catchAsync;
