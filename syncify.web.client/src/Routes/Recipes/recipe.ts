interface RecipeIngredient {
    id?: number;  // Optional since it's not required in all contexts
    name: string;
    unit: string;
    description?: string;
    quantity: number;
}

interface RecipeTag {
    id?: number;  // Optional since it's not required in all contexts
    name: string;
    recipeId?: number;  // Optional in some contexts
}

interface Recipe {
    id: number;
    name: string;
    description: string;
    prepTimeInMinutes: number;
    cookTimeInMinutes: number;
    servings: number;
    userFirstName: string;
    userId: number;
    ingredients: RecipeIngredient[];
    tags: RecipeTag[];
}

interface NewRecipe {
    name: string;
    description: string;
    prepTimeInMinutes: number;
    cookTimeInMinutes: number;
    servings: number;
    ingredients: RecipeIngredient[];
    tags: RecipeTag[];
}

export type { Recipe, RecipeIngredient, RecipeTag, NewRecipe };
