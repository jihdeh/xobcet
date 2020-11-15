/* eslint-disable global-require */
const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
// const httpMocks = require('node-mocks-http');
const { Core: app } = require('../../src/app');
const dbConfig = require('../utils/dbConfig');
// const { Recipe } = require('../../src/models');
const { insertRecipes } = require('../fixtures/recipe.fixture');

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

  describe('GET /recipes', () => {
    test('should return 200 and all recipes', async () => {
      await insertRecipes();
      const res = await request(app).get('/recipes').send().expect(httpStatus.OK);
      expect(res.body).toHaveLength(3);
    });
  });

  describe('POST /recipes', () => {
    jest.mock('ioredis', () => {
      // eslint-disable-next-line no-unused-vars
      const ioredis = require('redis-mock');
    });

    test('should create a new recipe', async () => {
      const res = await request(app).post('/recipes').send(newRecipe);
      expect(res.body.name).toBeDefined();
    });
  });
});
