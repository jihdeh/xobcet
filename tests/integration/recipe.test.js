/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const IoRedis = require('ioredis');
const RateLimiterLib = require('async-ratelimiter');

const { auth } = require('../../src/config/config');

jest.mock('ioredis', () => {
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

jest.mock('async-ratelimiter', () => {
  return function () {
    const rateClass = class RateLimiter {
      constructor() {
        this.get = {};
      }

      static get() {
        return {
          total: 0,
          remaining: 1,
          reset: true,
        };
      }
    };
    return rateClass;
  };
});

const { Core: app } = require('../../src/app');
const dbConfig = require('../utils/dbConfig');
const { insertRecipes, creatOneRecipe } = require('../fixtures/recipe.fixture');

dbConfig();

describe('Recipe routes', () => {
  let newRecipe;

  beforeEach(() => {
    newRecipe = {
      name: faker.lorem.word(),
      prepTime: `${faker.random.number(60)} mins`,
      difficulty: faker.random.number({ min: 1, max: 3 }),
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

    test('should return empty array if no list of results', async () => {
      const res = await request(app).get('/recipes?limit=3&page=2').send().expect(httpStatus.OK);
      expect(res.body.docs).toHaveLength(0);
      expect(res.body.totalDocs).toEqual(3);
      expect(res.body.hasNextPage).toEqual(false);
      expect(res.body.hasPrevPage).toEqual(true);
    });
  });

  describe('POST /recipes', () => {
    test('should create a new recipe', async () => {
      const res = await request(app)
        .post('/recipes')
        .auth(auth.username, auth.password)
        .send(newRecipe)
        .expect(httpStatus.OK);
      expect(res.body.name).toBeDefined();
      expect(res.body.uniqueId).toBeDefined();
      expect(res.body.difficulty).toBeDefined();
    });

    test('should report missing header when create a new recipe with no auth header', async () => {
      const res = await request(app)
        .post('/recipes')
        .send(newRecipe)
        .expect(httpStatus.UNAUTHORIZED);
      expect(res.body.message).toEqual('Missing Authorization Header');
    });

    test('should throw unathorized when create a new recipe with wrong credentials', async () => {
      const res = await request(app)
        .post('/recipes')
        .auth('wrongUsername', 'wrongPasswrd')
        .send(newRecipe)
        .expect(httpStatus.UNAUTHORIZED);
      expect(res.body.message).toEqual('Invalid Authentication Credentials');
    });

    test('should throw an error when required recipe field "name" is missing', async () => {
      newRecipe.name = '';
      const res = await request(app)
        .post('/recipes')
        .auth(auth.username, auth.password)
        .send(newRecipe)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body[0].message).toEqual('"name" is not allowed to be empty');
    });

    test('should throw an error when required recipe field "difficulty" is wrong', async () => {
      newRecipe.difficulty = 10;
      const res = await request(app)
        .post('/recipes')
        .auth(auth.username, auth.password)
        .send(newRecipe)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body[0].message).toEqual('"difficulty" must be less than or equal to 3');
    });
  });

  describe('PUT /recipes', () => {
    let recipe = {};
    beforeEach(async () => {
      recipe = await creatOneRecipe(newRecipe);
    });

    test('should update recipe', async () => {
      recipe.name = 'Regalia';
      const res = await request(app)
        .put(`/recipes/${recipe.uniqueId}`)
        .auth(auth.username, auth.password)
        .send(newRecipe);
      expect(res.text).toBeDefined();
      expect(res.text).toEqual('Recipe updated');
    });

    test('should throw on update recipe with wrong id', async () => {
      recipe.name = 'Regalia';
      const res = await request(app)
        .put(`/recipes/errorId`)
        .auth(auth.username, auth.password)
        .send(newRecipe);

      expect(res.body.code).toEqual(501);
      expect(res.body.message).toEqual('Recipe not updated');
    });
  });

  describe('DELETE /recipes', () => {
    let recipe = {};

    beforeEach(async () => {
      recipe = await creatOneRecipe(newRecipe);
    });

    test('should delete a  recipe', async () => {
      const res = await request(app)
        .delete(`/recipes/${recipe.uniqueId}`)
        .auth(auth.username, auth.password)
        .send(recipe);
      expect(res.text).toBeDefined();
      expect(res.text).toEqual('Recipe deleted');
    });

    test('should throw on delete a recipe with wrong id', async () => {
      const res = await request(app)
        .delete(`/recipes/wrongid`)
        .auth(auth.username, auth.password)
        .send(recipe);
      expect(res.body.code).toEqual(501);
      expect(res.body.message).toEqual('Recipe not deleted');
    });
  });
});
