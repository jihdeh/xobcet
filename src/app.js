const server = require('server');

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
} = require('./controllers/recipes.js');
const {
  createRecipeValidation,
  updateRecipeValidation,
} = require('./validations/recipe.validation');

const app = server();

app.get('/recipes', getRecipes);

app.get('/recipes/:id', getRecipe);

app.post('/recipes', createRecipeValidation, createRecipe);

app.put('/recipes/:id', updateRecipeValidation, updateRecipe);

app.delete('/recipes', deleteRecipe);

app.post('/recipes/:id/rating', rateRecipe);

module.exports = app;
