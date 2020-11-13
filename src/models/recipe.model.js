const mongoose = require('mongoose');
const validator = require('validator');
const short = require('short-uuid');

const recipeSchema = mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      default: short.generate(),
    },
    name: {
      type: String,
      required: true,
    },
    prepTime: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      validate(value) {
        if (!validator.isInt(value, { min: 1, max: 3, allow_leading_zeroes: false })) {
          throw new Error('Difficulty is not in range 1 - 3');
        }
      },
    },
    Vegetarian: {
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

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
