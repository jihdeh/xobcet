const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    REDIS_HOST: Joi.string().required().description('Redis host'),
    REDIS_PORT: Joi.string().required().description('Redis port'),
    REDIS_TTL: Joi.string().required().description('Redis ttl'),
    REDIS_PASSWORD: Joi.string().required().description('Redis password'),
    AUTH_USERNAME: Joi.string().required().description('Authorized user key'),
    AUTH_PASSWORD: Joi.string().required().description('Authorized password key'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    ttl: envVars.REDIS_TTL,
    password: envVars.REDIS_PASSWORD,
  },
  auth: {
    username: envVars.AUTH_USERNAME,
    password: envVars.AUTH_PASSWORD,
  },
};
