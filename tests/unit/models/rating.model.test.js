const faker = require('faker');
const mongoose = require('mongoose');
const { Rating } = require('../../../src/models');

describe('Rating model', () => {
  describe('Rating validation', () => {
    let newRating;

    beforeEach(() => {
      newRating = {
        rating: faker.random.number({ min: 1, max: 5 }),
        recipe: mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid recipe', async () => {
      await expect(new Rating(newRating).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if rating is not in range 1-5', async () => {
      newRating.rating = 10;
      await expect(new Rating(newRating).validate()).rejects.toThrow();
    });
  });
});
