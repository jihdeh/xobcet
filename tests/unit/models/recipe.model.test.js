const faker = require('faker');
const { Recipe } = require('../../../src/models');

describe('Recipe model', () => {
  describe('Recipe validation', () => {
    let newRecipe;

    beforeEach(() => {
      newRecipe = {
        name: faker.lorem.word(),
        prepTime: `${faker.random.number(60)} mins`,
        difficulty: faker.random.number({ min: 1, max: 3 }),
        vegetarian: faker.random.boolean(),
      };
    });

    test('should correctly validate a valid recipe', async () => {
      await expect(new Recipe(newRecipe).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if difficulty is not in range 1-3', async () => {
      newRecipe.difficulty = 10;
      await expect(new Recipe(newRecipe).validate()).rejects.toThrow();
    });
  });
});
