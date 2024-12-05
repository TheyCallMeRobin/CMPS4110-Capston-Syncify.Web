import React, { useEffect, useState } from 'react';
import './recipe.css';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import { RecipesService } from '../../api/generated/RecipesService';
import { ShoppingListItemService } from '../../api/generated/ShoppingListItemService';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService';
import {
  RecipeGetDto,
  RecipeIngredientGetDto,
  ShoppingListGetDto,
} from '../../api/generated/index.defs';
import { useAsyncFn } from 'react-use';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewRecipes = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeGetDto | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredientGetDto[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingListGetDto[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedShoppingList, setSelectedShoppingList] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

  const [fetchRecipeState, fetchRecipe] = useAsyncFn(async () => {
    const response = await RecipesService.getRecipeById({
      id: parseInt(recipeId || '0', 10),
    });
    return response?.data || null;
  }, [recipeId]);

  const [fetchIngredientsState, fetchIngredients] = useAsyncFn(async () => {
    const response = await RecipeIngredientService.getAll({
      recipeId: parseInt(recipeId || '0', 10),
    });
    return Array.isArray(response) ? response : response?.data || [];
  }, [recipeId]);

  const [fetchShoppingListsState, fetchShoppingLists] = useAsyncFn(async () => {
    const response = await ShoppingListsService.getShoppingLists();
    return Array.isArray(response) ? response : response?.data || [];
  }, []);

  useEffect(() => {
    fetchRecipe().then((data) => {
      if (data) setRecipe(data);
    });
    fetchIngredients().then((data) => {
      if (data) setIngredients(data);
    });
    fetchShoppingLists().then((data) => {
      if (data) setShoppingLists(data);
    });
  }, [fetchRecipe, fetchIngredients, fetchShoppingLists]);

  const handleIngredientSelect = (id: number) => {
    setSelectedIngredients((prev) =>
      prev.includes(id)
        ? prev.filter((ingredientId) => ingredientId !== id)
        : [...prev, id]
    );
  };

  const handleAddToSelectedList = async () => {
    if (!selectedShoppingList) {
      toast.error('Please select a shopping list.');
      return;
    }

    for (const ingredientId of selectedIngredients) {
      const ingredient = ingredients.find((ing) => ing.id === ingredientId);
      if (ingredient) {
        await ShoppingListItemService.createShoppingListItem({
          body: {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            shoppingListId: selectedShoppingList,
            isChecked: false,
          },
        });
      }
    }

    setSelectedIngredients([]);
    setSelectedShoppingList(null);
    toast.success('Ingredients successfully added to the shopping list!');
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="d-flex justify-content-start align-items-center mb-3">
        <button
          className="btn btn-success btn-sm"
          onClick={() => navigate('/recipes')}
        >
          <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Recipe List
        </button>
      </div>
      <h2 className="text-center text-highlight mb-4">
        {recipe.name || 'Untitled Recipe'}
      </h2>
      <div
        className="form-container mx-auto p-4 rounded bg-light"
        style={{ maxWidth: '800px', width: '100%' }}
      >
        <div className="mb-4">
          <p className="text-muted">
            {recipe.description || 'No description provided.'}
          </p>
        </div>

        <div className="my-4">
          <p className="mb-2">
            <strong>Prep Time:</strong>{' '}
            {Math.round((recipe.prepTimeInSeconds || 0) / 60)} minutes
          </p>
          <p className="mb-2">
            <strong>Cook Time:</strong>{' '}
            {Math.round((recipe.cookTimeInSeconds || 0) / 60)} minutes
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings || 'Not specified'}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-primary">Ingredients</h4>
          {fetchIngredientsState.loading ? (
            <div className="d-flex justify-content-center align-items-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : fetchIngredientsState.error ? (
            <p className="text-danger">
              Error loading ingredients. Please try again later.
            </p>
          ) : (
            <>
              <ul className="list-group mb-3">
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <label>
                        <span style={{ paddingRight: '10px' }}>
                          <input
                            type="checkbox"
                            checked={selectedIngredients.includes(
                              ingredient.id
                            )}
                            onChange={() =>
                              handleIngredientSelect(ingredient.id)
                            }
                          />
                        </span>
                        {ingredient.name || 'Unnamed ingredient'} -{' '}
                        {ingredient.quantity} {ingredient.unit}
                      </label>
                    </li>
                  ))
                ) : (
                  <p className="text-muted">No ingredients available.</p>
                )}
              </ul>

              {selectedIngredients.length > 0 && (
                <div className="mt-4">
                  <h5>Select a Shopping List</h5>
                  <select
                    className="form-select mb-3"
                    value={selectedShoppingList || ''}
                    onChange={(e) =>
                      setSelectedShoppingList(Number(e.target.value))
                    }
                  >
                    {shoppingLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddToSelectedList}
                    disabled={!selectedShoppingList}
                  >
                    Add Ingredients to Shopping List
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mb-4">
          <h4 className="text-primary">Instructions</h4>
          <div>
            {recipe.instructions
              ? recipe.instructions.split('\n').map((line, index) => (
                  <p key={index} className="text-muted">
                    {line}
                  </p>
                ))
              : 'No instructions available.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRecipes;