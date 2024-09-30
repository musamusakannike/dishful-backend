const sendResponse = require("../config/sendResponse");
const Recipe = require("../models/recipe.model");
const adminUsernames = require("../utils/adminUsernames");

const validateRecipeData = ({ title, ingredients, instructions, tags }) => {
  if (!title || !ingredients || !instructions) return "Missing required fields";
  if (typeof title !== "string" || title.length > 100)
    return "Invalid title format";
  if (
    !Array.isArray(ingredients) ||
    ingredients.some((ing) => typeof ing !== "string")
  )
    return "Invalid ingredients format";
  if (typeof instructions !== "string" || instructions.length > 5000)
    return "Invalid instructions format";
  if (
    (tags && !Array.isArray(tags)) ||
    (tags && tags.length > 10) ||
    (tags && tags.some((tag) => typeof tag !== "string"))
  )
    return "Invalid tags format";
  return null;
};

const postRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, tags } = req.body;

    // Check if an image was uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary provides the image URL in req.file.path
    }

    // Check for required fields
    if (!title || !ingredients || !instructions) {
      return sendResponse(res, 400, "Missing required fields");
    }

    // Validate user
    if (!req.user || !req.user._id) {
      return sendResponse(res, 401, "Unauthorized: User not logged in");
    }

    // Perform validation on title, ingredients, and instructions
    if (typeof title !== "string" || title.length > 100) {
      return sendResponse(res, 400, "Invalid title format");
    }

    if (
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      ingredients.some((ingredient) => typeof ingredient !== "string")
    ) {
      return sendResponse(res, 400, "Invalid ingredients format");
    }

    if (typeof instructions !== "string" || instructions.length > 5000) {
      return sendResponse(res, 400, "Invalid instructions format");
    }

    // Validate tags
    if (
      tags && !Array.isArray(tags) ||
      tags && tags.length > 10 ||
      tags && tags.some((tag) => typeof tag !== "string")
    ) {
      return sendResponse(res, 400, "Invalid tags format");
    }

    // Create new recipe
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      tags,
      imageUrl,
      postedBy: req.user._id,
    });

    await newRecipe.save();
    return sendResponse(res, 201, "New Recipe Posted", newRecipe);
  } catch (error) {
    console.error("Error in postRecipe:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return sendResponse(res, 404, "Recipe not found");
    return sendResponse(res, 200, "Recipe found", recipe);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    return sendResponse(res, 200, "All recipes found", allRecipes);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};

const updateRecipe = async (req, res) => {};

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return sendResponse(res, 404, "Recipe not found");
    //
    if (
      String(recipe.postedBy) !== String(req.user._id) &&
      !adminUsernames.includes(req.user.username)
    ) {
      console.log("Unauthorized user");
      return sendResponse(res, 401, "Unauthorized");
    }
    await Recipe.findByIdAndDelete(recipeId);
    return sendResponse(res, 200, "Recipe deleted");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};

module.exports = {
  postRecipe,
  getRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
};
