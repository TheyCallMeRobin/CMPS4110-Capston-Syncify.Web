import React from 'react';
import { Recipe } from './Recipe';  


interface RecipeListProps {
    recipes: Recipe[];
    onRecipeClick: (recipe: Recipe) => void;
    onDeleteRecipe: (recipeId: number) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onRecipeClick, onDeleteRecipe }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1000px', marginTop: '20px' }}>
            {recipes.map((recipe) => (
                <div key={recipe.id} style={{ width: '200px', margin: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s, box-shadow 0.3s' }} onClick={() => onRecipeClick(recipe)}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{recipe.name}</p>
                    <p>{recipe.description}</p>
                    <p><strong>Prep Time:</strong> {recipe.prepTimeInMinutes} minutes</p>
                    <p><strong>Cook Time:</strong> {recipe.cookTimeInMinutes} minutes</p>
                    <p><strong>Servings:</strong> {recipe.servings}</p>
                    <p><strong>Author:</strong> {recipe.userFirstName ? recipe.userFirstName : 'Unknown'}</p>

                    <div>
                        <p><strong>Ingredients:</strong></p>
                        <ul>
                            {recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    {ingredient.quantity} {ingredient.unit} {ingredient.name}{ingredient.description ? ` - ${ingredient.description}` : ''}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p><strong>Tags:</strong></p>
                        <ul>
                            {recipe.tags.map((tag) => (
                                <li key={tag.id}>{tag.name}</li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); onDeleteRecipe(recipe.id); }} style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default RecipeList;
