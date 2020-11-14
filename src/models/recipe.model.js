const mongoose = require('mongoose');
const short = require('short-uuid');
const pick = require('lodash/pick');

const recipeSchema = mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      default: short.generate(),
      index: 1,
    },
    name: {
      type: String,
      unique: true,
      required: true,
      index: 1,
    },
    prepTime: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      validate(value) {
        if (!(value >= 1) && !(value <= 3)) {
          throw new Error('Difficulty is not in range 1 - 3');
        }
      },
    },
    vegetarian: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);

/**
 * Methods
 */
recipeSchema.statics = {};

recipeSchema.methods.transform = function () {
  const recipe = this;
  return pick(recipe.toJSON(), ['vegetarian', 'uniqueId', 'name', 'difficulty', 'prepTime']);
};

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
