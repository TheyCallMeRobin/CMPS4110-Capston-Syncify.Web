import React from 'react';

// Define the Recipe type based on your backend DTO
interface Recipe {
    id: number;
    name: string;
    description: string;
    prepTimeInMinutes: number;
    cookTimeInMinutes: number;
    servings: number;
    userFirstName: string;
}

interface RecipeListProps {
    recipes: Recipe[];
    onRecipeClick: (recipe: Recipe) => void; // Function to handle recipe clicks
    onDeleteRecipe: (recipeId: number) => void; // Function to handle recipe deletion
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onRecipeClick, onDeleteRecipe }) => {
    return (
        <div className="content">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="section" onClick={() => onRecipeClick(recipe)}>
                    <p className="recipe-title">{recipe.name}</p>
                    <p>{recipe.description}</p>
                    <p><strong>Prep Time:</strong> {recipe.prepTimeInMinutes} minutes</p>
                    <p><strong>Cook Time:</strong> {recipe.cookTimeInMinutes} minutes</p>
                    <p><strong>Servings:</strong> {recipe.servings}</p>
                    <p><strong>Author:</strong> {recipe.userFirstName ? recipe.userFirstName : 'Unknown'}</p>
                    <button onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering recipe click
                        onDeleteRecipe(recipe.id);
                    }}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default RecipeList;
