import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [0, 'Preparation time cannot be negative']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [0, 'Cooking time cannot be negative']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  ingredients: {
    type: [String],
    required: [true, 'Ingredients are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one ingredient is required'
    }
  },
  instructions: {
    type: [String],
    required: [true, 'Instructions are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one instruction is required'
    }
  },
  tips: {
    type: [String],
    default: []
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;