const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    rate: {
      type: Number,
      required: true,
      validate(value) {
        if (!(value >= 1) && !(value <= 3)) {
          throw new Error('Difficulty is not in range 1 - 3');
        }
      },
    },
    recipe: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Recipe',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
