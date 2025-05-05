import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one ingredient is required",
      },
    },
    steps: {
      type: [String],
      required: [true, "Steps are required"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one step is required",
      },
    },
    recipeSource: {
      type: String,
      trim: true,
    },
    foodLocation: {
      type: String,
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
    nutritionalInfo: {
      calories: String,
      protein: String,
      fat: String,
      carbs: String,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "easy", "medium", "hard"],
      required: [true, "Difficulty level is required"],
    },
    timeEstimate: {
      type: String,
      required: [true, "Time estimate is required"],
    },
    pairings: {
      type: [String],
      default: [],
    },
    substitutions: [
      {
        ingredient: String,
        substitute: String,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
