const Redis = require('ioredis');
const { redis } = require('../config/config');

class RedisCache {
  constructor(ttl = redis.ttl) {
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

  async get(key) {
    const value = await this._redis.get(key);
    const validTypes = typeof value === 'string';
    if (value && validTypes) {
      const parseValue = JSON.parse(value);
      return parseValue;
    }
  }

  delete() {
    return this._redis.flushall();
  }
}

module.exports = new RedisCache();
