import express from 'express';
import { 
  getUserRecipes, 
  getRecipeById, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe,
  generateRecipeWithAI
} from '../controllers/recipe.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all recipes for the current user
router.get('/', getUserRecipes);

// Get a single recipe by ID
router.get('/:id', getRecipeById);

// Create a new recipe
router.post('/', createRecipe);

// Generate a recipe with AI
router.post('/generate', generateRecipeWithAI);

// Update a recipe
router.put('/:id', updateRecipe);

// Delete a recipe
router.delete('/:id', deleteRecipe);

export default router;