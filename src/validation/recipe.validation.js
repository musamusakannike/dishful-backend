import Joi from "joi";

export const validateRecipe = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    ingredients: Joi.array().items(Joi.string()).required().min(1),
    steps: Joi.array().items(Joi.string()).required().min(1),
    recipeSource: Joi.string().allow(""),
    foodLocation: Joi.string().allow(""),
    additionalInfo: Joi.string().allow(""),
    nutritionalInfo: Joi.object({
      calories: Joi.string().allow(""),
      protein: Joi.string().allow(""),
      fat: Joi.string().allow(""),
      carbs: Joi.string().allow(""),
    }),
    difficulty: Joi.string()
      .required()
      .valid("Easy", "Medium", "Hard", "easy", "medium", "hard"),
    timeEstimate: Joi.string().required(),
    pairings: Joi.array().items(Joi.string()),
    substitutions: Joi.array().items(
      Joi.object({
        ingredient: Joi.string().required(),
        substitute: Joi.string().required(),
      })
    ),
    userId: Joi.string().required(),
    _id: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
  });

  return schema.validate(data);
};
