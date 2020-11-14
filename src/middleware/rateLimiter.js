const httpStatus = require('http-status');
const RateLimiter = require('async-ratelimiter');
const { getClientIp } = require('request-ip');

const RedisClient = require('../utils/cache');

const rateLimiter = new RateLimiter({
  db: RedisClient.redisClient(),
  max: 3,
  duration: 60000, // 1min of restriction
});

const apiQuota = async (req, res, next) => {
  const clientIp = getClientIp(req);
  const limit = await rateLimiter.get({ id: clientIp });

  if (!res.finished && !res.headersSent) {
    res.setHeader('X-Rate-Limit-Limit', limit.total);
    res.setHeader('X-Rate-Limit-Remaining', Math.max(0, limit.remaining - 1));
    res.setHeader('X-Rate-Limit-Reset', limit.reset);
  }

  return !limit.remaining
    ? next({
        code: httpStatus.TOO_MANY_REQUESTS,
        message: 'Rate Limit Exceeded!',
      })
    : next();
};

module.exports = apiQuota;
