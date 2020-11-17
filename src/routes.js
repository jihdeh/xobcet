const RECIPES = '/recipes';

const RECIPES_ID = '/recipes/:id';

const RECIPES_RATING = `${RECIPES_ID}/rating`;

const RECIPES_SEARCH = `/search${RECIPES}`;

module.exports = {
  RECIPES,
  RECIPES_ID,
  RECIPES_RATING,
  RECIPES_SEARCH,
};
