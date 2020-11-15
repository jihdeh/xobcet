const mongoose = require('mongoose');
const faker = require('faker');
const { Recipe } = require('../../src/models');

const fakeRecipe = () => ({
  _id: mongoose.Types.ObjectId(),
  uniqueId: faker.random.uuid(),
  name: faker.lorem.word(),
  prepTime: `${faker.random.number(60)} mins`,
  difficulty: faker.random.number(3),
  vegetarian: faker.random.boolean(),
});

const recipes = [fakeRecipe(), fakeRecipe(), fakeRecipe()];

const insertRecipes = async () => {
  await Recipe.insertMany(recipes.map((recipe) => ({ ...recipe })));
};
module.exports = {
  insertRecipes,
};
