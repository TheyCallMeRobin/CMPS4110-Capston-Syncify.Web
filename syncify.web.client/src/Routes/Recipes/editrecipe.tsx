import React, { useState, useEffect } from 'react';
import './recipe.css';
import { RecipesService } from '../../api/generated/RecipesService';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import {
  RecipeGetDto,
  RecipeIngredientGetDto,
} from '../../api/generated/index.defs';
import EditIngredient from './editingredient';
import { useAsyncFn } from 'react-use';
import { FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface EditRecipesProps {
  recipe: RecipeGetDto;
  onUpdate: (updatedRecipe: RecipeGetDto) => void;
  onClose: () => void;
}

const EditRecipes: React.FC<EditRecipesProps> = ({
  recipe,
  onUpdate,
  onClose,
}) => {
  const [editRecipe, setEditRecipe] = useState<RecipeGetDto>(recipe);
  const [ingredients, setIngredients] = useState<RecipeIngredientGetDto[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ingredientErrors, setIngredientErrors] = useState<{
    [key: string]: string;
  }>({});

  const [state, fetchIngredients] = useAsyncFn(async () => {
    const ingredientsResponse = await RecipeIngredientService.getAll({
      recipeId: recipe.id,
    });
    return Array.isArray(ingredientsResponse)
      ? ingredientsResponse
      : ingredientsResponse?.data || [];
  }, [recipe.id]);

  const [updateRecipeState, handleUpdateRecipe] = useAsyncFn(async () => {
    const response = await RecipesService.updateRecipe({
      id: editRecipe.id,
      body: editRecipe,
    });
    if (response?.data) {
      setErrors({});
      onUpdate(editRecipe);
      toast.success('Recipe updated successfully!');
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
  }, [editRecipe]);

  const [addIngredientState, handleAddIngredient] = useAsyncFn(
    async (newIngredient: Omit<RecipeIngredientGetDto, 'id'>) => {
      const ingredientToCreate = { ...newIngredient, recipeId: editRecipe.id };
      const response = await RecipeIngredientService.create({
        body: ingredientToCreate,
      });

      if (response?.data) {
        setIngredientErrors({});
        setIngredients((prev) => [
          ...prev,
          response.data as RecipeIngredientGetDto,
        ]);
        return { data: response.data };
      } else if (response?.errors) {
        const fieldErrors = response.errors.map((error: any) => ({
          errorMessage: error.errorMessage || 'Unknown error',
          propertyName: error.propertyName || '',
        }));
        setIngredientErrors(
          fieldErrors.reduce(
            (acc, error) => ({
              ...acc,
              [error.propertyName]: error.errorMessage,
            }),
            {}
          )
        );
        return { data: undefined, errors: fieldErrors };
      }
      return {
        data: undefined,
        errors: [{ errorMessage: 'Unknown error occurred', propertyName: '' }],
      };
    },
    [editRecipe.id]
  );

  const handleUpdateIngredient = async (
    ingredientId: number,
    updatedIngredient: RecipeIngredientGetDto
  ) => {
    const response = await RecipeIngredientService.update({
      id: ingredientId,
      body: updatedIngredient,
    });
    if (response?.data) {
      setIngredients((prevIngredients) =>
        prevIngredients
          .map((ingredient) =>
            ingredient.id === ingredientId ? response.data : ingredient
          )
          .filter(
            (ingredient): ingredient is RecipeIngredientGetDto =>
              ingredient !== null
          )
      );
      return { data: response.data }; 
    } else if (response?.errors) {
      const fieldErrors = response.errors.reduce(
        (acc: { [key: string]: string }, error: any) => {
          acc[error.propertyName.toLowerCase()] = error.errorMessage;
          return acc;
        },
        {}
      );
      setIngredientErrors(fieldErrors);
      return { data: undefined, errors: response.errors }; 
    }
    return {
      data: undefined,
      errors: [{ errorMessage: 'Unknown error occurred', propertyName: '' }],
    };
  };

  const [deleteIngredientState, handleDeleteIngredient] = useAsyncFn(
    async (ingredientId: number) => {
      const response = await RecipeIngredientService.delete({
        id: ingredientId,
      });
      if (response) {
        setIngredients((prev) =>
          prev.filter((ingredient) => ingredient.id !== ingredientId)
        );
        return { data: response };
      } else {
        return {
          data: undefined,
          errors: [{ errorMessage: 'Error deleting ingredient' }],
        };
      }
    },
    []
  );

  useEffect(() => {
    fetchIngredients().then((ingredientsData) => {
      setIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
    });
  }, [fetchIngredients]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]:
        name === 'prepTimeInSeconds' || name === 'cookTimeInSeconds'
          ? Number(value) * 60
          : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Recipe</h3>

        <label>Recipe Name</label>
        <input
          type="text"
          name="name"
          value={editRecipe.name}
          onChange={handleInputChange}
        />
        {errors.name && (
          <p className="error-text">
            <FaExclamationCircle
              style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
            />
            {errors.name}
          </p>
        )}

        <label>Description</label>
        <textarea
          className="form-control mb-2"
          name="description"
          value={editRecipe.description || ''}
          onChange={handleInputChange}
        />
        {errors.description && (
          <p className="error-text">
            <FaExclamationCircle
              style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
            />
            {errors.description}
          </p>
        )}
        <label>Instructions</label>
        <textarea
          className="form-control mb-2"
          name="instructions"
          value={editRecipe.instructions || ''}
          onChange={handleInputChange}
        />
        {errors.instructions && (
          <p className="error-text">
            <FaExclamationCircle
              style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
            />
            {errors.instructions}
          </p>
        )}

        <label>Prep Time (minutes)</label>
        <input
          type="number"
          name="prepTimeInSeconds"
          value={
            editRecipe.prepTimeInSeconds
              ? editRecipe.prepTimeInSeconds / 60
              : ''
          }
          onChange={handleInputChange}
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
          name="cookTimeInSeconds"
          value={
            editRecipe.cookTimeInSeconds
              ? editRecipe.cookTimeInSeconds / 60
              : ''
          }
          onChange={handleInputChange}
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
          name="servings"
          value={editRecipe.servings || ''}
          onChange={handleInputChange}
        />
        {errors.servings && (
          <p className="error-text">
            <FaExclamationCircle
              style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
            />
            {errors.servings}
          </p>
        )}

        <EditIngredient
          ingredients={Array.isArray(ingredients) ? ingredients : []}
          onAdd={handleAddIngredient}
          onDelete={handleDeleteIngredient}
          recipeId={editRecipe.id}
          onUpdate={handleUpdateIngredient}
        />

        <button
          onClick={() => handleUpdateRecipe()}
          className="btn btn-primary"
          disabled={updateRecipeState.loading}
        >
          {updateRecipeState.loading ? 'Updating...' : 'Update Recipe'}
        </button>
      </div>
    </div>
  );
};

export default EditRecipes;
