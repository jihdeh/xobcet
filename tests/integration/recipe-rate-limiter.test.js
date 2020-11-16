/* eslint-disable no-unused-vars */
const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const IoRedis = require('ioredis');

const { Core: app } = require('../../src/app');
const dbConfig = require('../utils/dbConfig');

dbConfig();

jest.mock('ioredis', () => {
  // eslint-disable-next-line global-require
  const Redis = require('ioredis-mock');
  if (typeof Redis === 'object') {
    // the first mock is an ioredis shim because ioredis-mock depends on it
    // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
    return {
      Command: { _transformer: { argument: {}, reply: {} } },
    };
  }
  // second mock for our code
  return function (...args) {
    return new Redis(args);
  };
});

describe('Rate Limiter Test', () => {
  let newRecipe;

  beforeEach(() => {
    newRecipe = {
      name: faker.lorem.word(),
      prepTime: `${faker.random.number(60)} mins`,
      difficulty: faker.random.number({ min: 1, max: 3 }),
      vegetarian: faker.random.boolean(),
    };
  });

  test('should trigger rate limit on 3rd consequetive click', async () => {
    await request(app).post('/recipes').send(newRecipe).expect(httpStatus.OK);
    await request(app).post('/recipes').send(newRecipe).expect(httpStatus.OK);
    await request(app).post('/recipes').send(newRecipe).expect(httpStatus.OK);
    const res4 = await request(app).put(`/recipes/${newRecipe.uniqueId}`).send(newRecipe);

    expect(res4.body).toBeDefined();
    expect(res4.body.code).toEqual(429);
    expect(res4.body.message).toEqual('Rate Limit Exceeded!');
  });
});
