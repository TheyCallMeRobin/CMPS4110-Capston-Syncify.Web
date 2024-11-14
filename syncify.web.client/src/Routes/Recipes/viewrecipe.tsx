import React, { useEffect, useState } from 'react';
import './recipe.css';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import {
  RecipeGetDto,
  RecipeIngredientGetDto,
} from '../../api/generated/index.defs';
import { useAsyncFn } from 'react-use';

interface ViewRecipesProps {
  recipe: RecipeGetDto;
  onClose: () => void;
}

const ViewRecipes: React.FC<ViewRecipesProps> = ({ recipe, onClose }) => {
  const [ingredients, setIngredients] = useState<RecipeIngredientGetDto[]>([]);

  const [state, fetchIngredients] = useAsyncFn(async () => {
    const ingredientsResponse = await RecipeIngredientService.getAll({
      recipeId: recipe.id,
    });
    return Array.isArray(ingredientsResponse)
      ? ingredientsResponse
      : ingredientsResponse?.data || [];
  }, [recipe.id]);

  useEffect(() => {
    fetchIngredients().then((ingredientsData) =>
      setIngredients(ingredientsData)
    );
  }, [fetchIngredients]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{recipe.name}</h3>
        <p>{recipe.description}</p>
        <p>
          Prep Time: {Math.round((recipe.prepTimeInSeconds || 0) / 60)} minutes
        </p>
        <p>
          Cook Time: {Math.round((recipe.cookTimeInSeconds || 0) / 60)} minutes
        </p>
        <p>Servings: {recipe.servings}</p>
        <h4>Ingredients</h4>

        {state.loading ? (
          <p>Loading ingredients...</p>
        ) : state.error ? (
          <p>Error loading ingredients.</p>
        ) : (
          <ul>
            {ingredients.length > 0 ? (
              ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {ingredient.description} -{' '}
                  {ingredient.quantity} {ingredient.unit}
                </li>
              ))
            ) : (
              <p>No ingredients available</p>
            )}
          </ul>
        )}

        <button onClick={onClose} className="btn btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewRecipes;
