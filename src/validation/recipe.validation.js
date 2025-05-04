import Joi from 'joi';

export const validateRecipe = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10),
    prepTime: Joi.number().required().min(0),
    cookTime: Joi.number().required().min(0),
    servings: Joi.number().required().min(1),
    difficulty: Joi.string().required().valid('Easy', 'Medium', 'Hard'),
    ingredients: Joi.array().items(Joi.string()).required().min(1),
    instructions: Joi.array().items(Joi.string()).required().min(1),
    tips: Joi.array().items(Joi.string()),
    userId: Joi.string().required(),
    _id: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  });
  
  return schema.validate(data);
};