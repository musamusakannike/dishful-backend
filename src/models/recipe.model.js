const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
  ],
  instructions: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String, // New field to store image URL
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
