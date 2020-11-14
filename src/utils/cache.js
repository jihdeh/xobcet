const Redis = require('ioredis');
const { redis } = require('../config/config');

class RedisCache {
  constructor(ttl = redis.REDIS_TTL) {
    this._redis = new Redis({
      port: redis.port,
      host: redis.host,
      password: redis.password,
    });
    this.ttl = ttl;
  }

  redisClient() {
    return this._redis;
  }

  set(key, value) {
    const setValue = this._redis.set(key, JSON.stringify(value));
    this._redis.expire(key, this.ttl);
    return setValue;
  }

  get(key) {
    const value = this._redis.get(key);
    const validTypes = typeof value === 'string';
    if (value && validTypes) {
      const parseValue = JSON.parse(value);
      return parseValue;
    }
  }
}

module.exports = new RedisCache();
