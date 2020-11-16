const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      validate(value) {
        if (!(value >= 1 && value <= 5)) {
          throw new Error('Rating is not in range 1 - 5');
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
