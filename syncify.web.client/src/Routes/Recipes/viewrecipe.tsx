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

const formatInstructions = (
  instructions: string,
  chunkSize: number
): string[] => {
  if (!instructions || instructions.trim() === '')
    return ['No instructions available.'];
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return instructions.match(regex)?.map((chunk) => chunk.trim() + '-') || [];
};

const ViewRecipes: React.FC<ViewRecipesProps> = ({ recipe, onClose }) => {
  const [ingredients, setIngredients] = useState<RecipeIngredientGetDto[]>([]);

  const [state, fetchIngredients] = useAsyncFn(async () => {
    const response = await RecipeIngredientService.getAll({
      recipeId: recipe.id,
    });
    return Array.isArray(response) ? response : response?.data || [];
  }, [recipe.id]);

  useEffect(() => {
    fetchIngredients().then((data) => {
      if (data) setIngredients(data);
    });
  }, [fetchIngredients]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{recipe.name || 'Untitled Recipe'}</h3>

        <p>{recipe.description || 'No description provided.'}</p>

        <div>
          {formatInstructions(recipe.instructions || '', 150).map(
            (line, index) => (
              <p key={index}>{line}</p>
            )
          )}
        </div>

        <div>
          <p>
            <strong>Prep Time:</strong>{' '}
            {Math.round((recipe.prepTimeInSeconds || 0) / 60)} minutes
          </p>
          <p>
            <strong>Cook Time:</strong>{' '}
            {Math.round((recipe.cookTimeInSeconds || 0) / 60)} minutes
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings || 'Not specified'}
          </p>
        </div>

        <h4>Ingredients</h4>
        {state.loading ? (
          <p>Loading ingredients...</p>
        ) : state.error ? (
          <p>Error loading ingredients. Please try again later.</p>
        ) : (
          <ul>
            {ingredients.length > 0 ? (
              ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name || 'Unnamed ingredient'} -{' '}
                  {ingredient.quantity} {ingredient.unit}
                </li>
              ))
            ) : (
              <p>No ingredients available.</p>
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
