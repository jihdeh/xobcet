/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const IoRedis = require('ioredis');
// const httpMocks = require('node-mocks-http');

jest.mock('ioredis', () => {
  // eslint-disable-next-line no-unused-vars
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

const { Core: app } = require('../../src/app');
const dbConfig = require('../utils/dbConfig');
// const { Recipe } = require('../../src/models');
const { insertRecipes, creatOneRecipe } = require('../fixtures/recipe.fixture');

dbConfig();

describe('Recipe routes', () => {
  let newRecipe;

  beforeEach(() => {
    newRecipe = {
      name: faker.lorem.word(),
      prepTime: `${faker.random.number(60)} mins`,
      difficulty: faker.random.number(3),
      vegetarian: faker.random.boolean(),
    };
  });

  describe('GET /recipe', () => {
    test('should return 200 and one recipe', async () => {
      const recipe = await creatOneRecipe(newRecipe);
      const res = await request(app)
        .get(`/recipes/${recipe.uniqueId}`)
        .send()
        .expect(httpStatus.OK);
      expect(res.body.name).toBeDefined();
    });

    test('should return 404 for recipe not found', async () => {
      const res = await request(app).get(`/recipes/wrongin`).send().expect(httpStatus.NOT_FOUND);
      expect(res.body.message).toBe('Recipe not found');
    });
  });

  describe('GET /recipes', () => {
    beforeEach(async () => {
      await insertRecipes();
    });

    test('should return 200 and all recipes', async () => {
      const res = await request(app).get('/recipes').send().expect(httpStatus.OK);
      expect(res.body.docs).toHaveLength(3);
    });

    test('should paginate recipe result', async () => {
      const res = await request(app).get('/recipes?limit=1').send().expect(httpStatus.OK);
      expect(res.body.docs).toHaveLength(1);
      expect(res.body.totalDocs).toEqual(3);
      expect(res.body.hasNextPage).toEqual(true);
    });

    test('should fetch next list of recipe results', async () => {
      const res = await request(app).get('/recipes?limit=1&page=2').send().expect(httpStatus.OK);
      expect(res.body.docs).toHaveLength(1);
      expect(res.body.totalDocs).toEqual(3);
      expect(res.body.hasNextPage).toEqual(true);
      expect(res.body.hasPrevPage).toEqual(true);
    });
  });

  describe('POST /recipes', () => {
    test('should create a new recipe', async () => {
      // const res = await request(app).post('/recipes').send(newRecipe);
      // expect(res.body.name).toBeDefined();
    });
  });
});
