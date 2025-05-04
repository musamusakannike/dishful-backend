import { GoogleGenAI } from "@google/genai";
import { Type } from "@google/genai";

// Initialize the Google Generative AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateRecipe = async (prompt) => {
  try {
    // Create a more detailed prompt for the AI
    const enhancedPrompt = `Generate a detailed recipe based on the following request: "${prompt}". 
    Make sure the recipe is practical, delicious, and includes all necessary details.`;

    // Generate recipe with structured output
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: enhancedPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            'name': {
              type: Type.STRING,
              description: 'Name of the recipe',
              nullable: false,
            },
            'description': {
              type: Type.STRING,
              description: 'Brief description of the recipe',
              nullable: false,
            },
            'prepTime': {
              type: Type.INTEGER,
              description: 'Preparation time in minutes',
              nullable: false,
            },
            'cookTime': {
              type: Type.INTEGER,
              description: 'Cooking time in minutes',
              nullable: false,
            },
            'servings': {
              type: Type.INTEGER,
              description: 'Number of servings',
              nullable: false,
            },
            'difficulty': {
              type: Type.STRING,
              description: 'Difficulty level (Easy, Medium, Hard)',
              nullable: false,
            },
            'ingredients': {
              type: Type.ARRAY,
              description: 'List of ingredients with measurements',
              items: {
                type: Type.STRING
              },
              nullable: false,
            },
            'instructions': {
              type: Type.ARRAY,
              description: 'Step-by-step cooking instructions',
              items: {
                type: Type.STRING
              },
              nullable: false,
            },
            'tips': {
              type: Type.ARRAY,
              description: 'Optional cooking tips and variations',
              items: {
                type: Type.STRING
              },
              nullable: true,
            }
          },
          required: ['name', 'description', 'prepTime', 'cookTime', 'servings', 'difficulty', 'ingredients', 'instructions'],
        },
      },
    });

    // Parse the JSON response
    const recipeData = JSON.parse(response.text);
    
    return recipeData;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate recipe with AI');
  }
};