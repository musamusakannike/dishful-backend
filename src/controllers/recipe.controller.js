import Recipe from '../models/recipe.model.js';
import { validateRecipe } from '../validation/recipe.validation.js';
import { genTextRecipe, genIngredientsRecipe, genRandomRecipe, genLeftoversRecipe } from '../lib/gemini.js';

// Get all recipes for the current user
export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Server error while fetching recipes' });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if the recipe belongs to the current user
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this recipe' });
    }
    
    res.status(200).json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Server error while fetching recipe' });
  }
};

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const { recipe } = req.body;
    
    // Add userId to the recipe
    recipe.userId = req.userId;
    
    // Validate recipe data
    const { error } = validateRecipe(recipe);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    // Create and save the new recipe
    const newRecipe = new Recipe(recipe);
    await newRecipe.save();
    
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Server error while creating recipe' });
  }
};

// Generate a recipe using Gemini API
export const generateRecipeWithAI = async (req, res) => {
  try {
    const { prompt, type = 'text', ingredients, leftovers } = req.body;
    
    let recipe;
    
    switch (type) {
      case 'ingredients':
        if (!ingredients || !Array.isArray(ingredients)) {
          return res.status(400).json({ message: 'Ingredients array is required for ingredients type' });
        }
        recipe = await genIngredientsRecipe(req, res);
        break;
        
      case 'leftovers':
        if (!leftovers || !Array.isArray(leftovers)) {
          return res.status(400).json({ message: 'Leftovers array is required for leftovers type' });
        }
        recipe = await genLeftoversRecipe(req, res);
        break;
        
      case 'random':
        recipe = await genRandomRecipe(req, res);
        break;
        
      case 'text':
      default:
        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
          return res.status(400).json({ message: 'Valid prompt is required for text type' });
        }
        req.body.food = prompt;
        recipe = await genTextRecipe(req, res);
        break;
    }
    
    return recipe;
  } catch (error) {
    console.error('Generate recipe error:', error);
    res.status(500).json({ message: 'Server error while generating recipe' });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if the recipe belongs to the current user
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    
    await Recipe.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Server error while deleting recipe' });
  }
};

// Update a recipe
export const updateRecipe = async (req, res) => {
  try {
    const { recipe } = req.body;
    
    // Validate recipe data
    const { error } = validateRecipe(recipe);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const existingRecipe = await Recipe.findById(req.params.id);
    
    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if the recipe belongs to the current user
    if (existingRecipe.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      recipe,
      { new: true }
    );
    
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Server error while updating recipe' });
  }
};