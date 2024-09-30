const express = require("express");
const multer = require("multer");
const {storage} = require("../config/cloudinary");
const {
  postRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
} = require("../controllers/recipe.controller");

const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.single("image"), postRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipe);
router.put("/", updateRecipe);
router.delete("/:id", deleteRecipe);

module.exports = router;
