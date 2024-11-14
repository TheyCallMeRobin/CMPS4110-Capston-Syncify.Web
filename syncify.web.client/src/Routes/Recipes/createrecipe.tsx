import { RecipesService } from '../../api/generated/RecipesService';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import React, { useState, useEffect } from 'react';
import {
  RecipeCreateDto,
  RecipeIngredientCreateDto,
  RecipeGetDto,
} from '../../api/generated/index.defs';
import './recipe.css';
import { useAsyncFn } from 'react-use';
import { FaExclamationCircle } from 'react-icons/fa';

interface CreateRecipeProps {
  onCreate: (newRecipe: RecipeGetDto) => void;
  onClose: () => void;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ onCreate, onClose }) => {
  const [newRecipe, setNewRecipe] = useState<RecipeCreateDto>({
    name: '',
    description: '',
    prepTimeInSeconds: undefined,
    cookTimeInSeconds: undefined,
    servings: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ingredientErrors, setIngredientErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [createdRecipeId, setCreatedRecipeId] = useState<number | null>(null);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    description: '',
    quantity: 0,
    unit: '',
  });
  const [ingredients, setIngredients] = useState<RecipeIngredientCreateDto[]>(
    []
  );
  const [recipeCreated, setRecipeCreated] = useState(false);
  const [ingredientsAdded, setIngredientsAdded] = useState(false);

  useEffect(() => {
    if (recipeCreated && ingredientsAdded) {
      setRecipeCreated(false);
      setIngredientsAdded(false);
    }
  }, [recipeCreated, ingredientsAdded]);

  const [createRecipeState, handleCreateRecipe] = useAsyncFn(async () => {
    const recipeToCreate = {
      ...newRecipe,
      prepTimeInSeconds: newRecipe.prepTimeInSeconds ?? 0,
      cookTimeInSeconds: newRecipe.cookTimeInSeconds ?? 0,
    };

    const response = await RecipesService.createRecipe({
      body: recipeToCreate,
    });
    if (response?.data) {
      setErrors({});
      setCreatedRecipeId(response.data.id);
      onCreate(response.data);
      setIsIngredientModalOpen(true);
      setRecipeCreated(true);
    } else if (response?.errors) {
      const fieldErrors = response.errors.reduce(
        (acc: { [key: string]: string }, error: any) => {
          acc[error.propertyName.toLowerCase()] = error.errorMessage;
          return acc;
        },
        {}
      );

      setErrors(fieldErrors);
    }
  }, [newRecipe]);

  const [addIngredientState, handleAddIngredient] = useAsyncFn(async () => {
    if (!createdRecipeId) return;

    const ingredientToCreate = { ...newIngredient, recipeId: createdRecipeId };

    const response = await RecipeIngredientService.create({
      body: ingredientToCreate,
    });

    if (response?.data) {
      setIngredientErrors({});
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        response.data as RecipeIngredientCreateDto,
      ]);
      setNewIngredient({ name: '', description: '', quantity: 0, unit: '' });
    } else if (response?.errors) {
      const fieldErrors = response.errors.reduce(
        (acc: { [key: string]: string }, error: any) => {
          acc[error.propertyName.toLowerCase()] = error.errorMessage;
          return acc;
        },
        {}
      );
      setIngredientErrors(fieldErrors);
    }
  }, [newIngredient, createdRecipeId]);

  const handleDoneAddingIngredients = () => {
    setIngredientsAdded(true);
    setIsIngredientModalOpen(false);
    setCreatedRecipeId(null);
    onClose();
  };

  const availableUnits = [
    'tsp',
    'tbsp',
    'cup',
    'pint',
    'quart',
    'gallon',
    'ml',
    'l',
    'oz',
    'lb',
    'g',
    'kg',
    'mg',
    'pinch',
    'dash',
    'fl oz',
    'piece',
  ];

  const formatUnit = (unit: string) => {
    return unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase();
  };

  return (
    <>
      {!isIngredientModalOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Create New Recipe</h3>

            <label>Recipe Name</label>
            <input
              type="text"
              className="form-control mb-2"
              value={newRecipe.name}
              onChange={(e) =>
                setNewRecipe((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {errors.name && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {errors.name}
              </p>
            )}

            <label>Prep Time (minutes)</label>
            <input
              type="number"
              className="form-control mb-2"
              min="0"
              value={
                newRecipe.prepTimeInSeconds !== undefined
                  ? newRecipe.prepTimeInSeconds / 60
                  : ''
              }
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0) {
                  setNewRecipe((prev) => ({
                    ...prev,
                    prepTimeInSeconds: value * 60,
                  }));
                }
              }}
            />
            {errors.preptimeinseconds && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {errors.preptimeinseconds}
              </p>
            )}

            <label>Cook Time (minutes)</label>
            <input
              type="number"
              className="form-control mb-2"
              min="0"
              value={
                newRecipe.cookTimeInSeconds !== undefined
                  ? newRecipe.cookTimeInSeconds / 60
                  : ''
              }
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0) {
                  setNewRecipe((prev) => ({
                    ...prev,
                    cookTimeInSeconds: value * 60,
                  }));
                }
              }}
            />
            {errors.cooktimeinseconds && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {errors.cooktimeinseconds}
              </p>
            )}

            <label>Servings</label>
            <input
              type="number"
              className="form-control mb-2"
              min="0"
              value={newRecipe.servings !== undefined ? newRecipe.servings : ''}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0) {
                  setNewRecipe((prev) => ({ ...prev, servings: value }));
                }
              }}
            />
            {errors.servings && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {errors.servings}
              </p>
            )}

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button className="btn btn-primary" onClick={handleCreateRecipe}>
              Create Recipe
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isIngredientModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsIngredientModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Ingredients to Recipe</h3>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.description} -{' '}
                  {ingredient.quantity} {ingredient.unit}
                </li>
              ))}
            </ul>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingredient Name"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
            />
            {ingredientErrors.name && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {ingredientErrors.name}
              </p>
            )}

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Description"
              value={newIngredient.description}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  description: e.target.value,
                })
              }
            />
            {ingredientErrors.description && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {ingredientErrors.description}
              </p>
            )}

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Quantity"
              min="0"
              value={newIngredient.quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0) {
                  setNewIngredient({ ...newIngredient, quantity: value });
                }
              }}
            />
            {ingredientErrors.quantity && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {ingredientErrors.quantity}
              </p>
            )}

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Unit"
              value={newIngredient.unit}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  unit: formatUnit(e.target.value),
                })
              }
            />
            {ingredientErrors.unit && (
              <p className="error-text">
                <FaExclamationCircle
                  style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                />
                {ingredientErrors.unit}
              </p>
            )}
            <h4>Available Units:</h4>
            <p style={{ textAlign: 'center' }}>{availableUnits.join(', ')}</p>

            <button className="btn btn-primary" onClick={handleAddIngredient}>
              Add Ingredient
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleDoneAddingIngredients}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRecipe;
