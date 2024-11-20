import React, { useEffect, useState } from 'react';
import './recipe.css';
import './../../index.css';
import { RecipesService } from '../../api/generated/RecipesService';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import {
  RecipeGetDto,
  RecipeIngredientGetDto,
} from '../../api/generated/index.defs';
import { useUser } from '../../auth/auth-context';
import { FaEllipsisV, FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import image from '../../Images/Feast.png';
import CreateRecipe from './createrecipe';
import ViewRecipes from './viewrecipe';
import EditRecipes from './editrecipe';
import { useAsyncFn } from 'react-use';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState<RecipeGetDto[]>([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<RecipeGetDto | null>(
    null
  );
  const [recipeOfTheDayIngredients, setRecipeOfTheDayIngredients] = useState<
    RecipeIngredientGetDto[]
  >([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewRecipe, setViewRecipe] = useState<RecipeGetDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<RecipeGetDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRecipeIngredients, setEditRecipeIngredients] = useState<
    RecipeIngredientGetDto[]
  >([]);
  const user = useUser();

  const [fetchRecipesState, fetchRecipes] = useAsyncFn(async () => {
    if (!user?.id) return;
    const response = await RecipesService.getRecipesByUserId({
      userId: user.id,
    });
    setRecipes(response.data || []);
  }, [user?.id]);

  const [fetchRecipeOfTheDayState, fetchRecipeOfTheDay] =
    useAsyncFn(async () => {
      const recipeOfTheDayResponse = await RecipesService.getRecipeOfTheDay();
      const recipe = recipeOfTheDayResponse.data || null;
      setRecipeOfTheDay(recipe);

      if (recipe) {
        const ingredientsResponse = await RecipeIngredientService.getAll({
          recipeId: recipe.id,
        });
        setRecipeOfTheDayIngredients(ingredientsResponse.data || []);
      }
    }, []);

  useEffect(() => {
    fetchRecipes();
    fetchRecipeOfTheDay();
  }, [fetchRecipes, fetchRecipeOfTheDay]);

  const handleViewClick = (recipe: RecipeGetDto) => {
    setViewRecipe(recipe);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewRecipe(null);
  };

  const handleEditClick = async (recipe: RecipeGetDto) => {
    setEditRecipe(recipe);
    setIsEditModalOpen(true);

    const ingredientsResponse = await RecipeIngredientService.getAll({
      recipeId: recipe.id,
    });
    setEditRecipeIngredients(ingredientsResponse.data || []);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditRecipe(null);
    setEditRecipeIngredients([]);
  };

  const handleUpdateRecipe = (updatedRecipe: RecipeGetDto) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    handleCloseEditModal();
  };

  const handleAddRecipe = (newRecipe: RecipeGetDto) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const [deleteRecipeState, handleDeleteRecipe] = useAsyncFn(
    async (recipeId: number) => {
      await RecipesService.deleteRecipe({ id: recipeId });
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );
      return 'Recipe deleted successfully!';
    },
    [recipes]
  );

  useEffect(() => {
    if (deleteRecipeState.value) {
      toast.success(deleteRecipeState.value);
    }
  }, [deleteRecipeState.value]);

  useEffect(() => {
    if (deleteRecipeState.error) {
      const errorMessage =
        (deleteRecipeState.error as any)?.errors?.[0]?.errorMessage ||
        deleteRecipeState.error.message ||
        'Failed to delete recipe. Please try again.';
      toast.error(errorMessage);
    }
  }, [deleteRecipeState.error]);

  return (
    <div className="page-content">
      <ToastContainer />
      <h2 className="text-center text-highlight mb-4">My Recipes</h2>

      <div className="recipe-of-the-day-container">
        <div className="recipe-of-the-day-wrapper">
          <h3 className="recipe-of-the-day-title text-center">
            Recipe of the Day
          </h3>
          <div className="recipe-of-the-day-card">
            <img
              src={image}
              alt="Recipe of the Day"
              className="recipe-of-the-day-image"
            />
            <div className="recipe-of-the-day-content">
              <h4>{recipeOfTheDay?.name || 'No Recipe'}</h4>
              <p>{recipeOfTheDay?.description || 'No description available'}</p>
              <small>
                Prep Time:{' '}
                {Math.round((recipeOfTheDay?.prepTimeInSeconds || 0) / 60)}{' '}
                minutes
              </small>
              <small>
                Cook Time:{' '}
                {Math.round((recipeOfTheDay?.cookTimeInSeconds || 0) / 60)}{' '}
                minutes
              </small>
              <small>Servings: {recipeOfTheDay?.servings || 'N/A'}</small>
              <h5>Ingredients</h5>
              <ul className="recipe-of-the-day-ingredients">
                {recipeOfTheDayIngredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="recipecontainer">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img src={image} alt="Recipe Image" className="recipe-image" />
            <div className="recipe-card-content">
              <h4>{recipe.name}</h4>
              <p>
                {recipe.description
                  ? recipe.description.length > 50
                    ? `${recipe.description.substring(0, 50)}...`
                    : recipe.description
                  : 'No description available'}
              </p>
              <small>
                Prep Time: {Math.round((recipe.prepTimeInSeconds || 0) / 60)}{' '}
                minutes
              </small>
              <small>
                Cook Time: {Math.round((recipe.cookTimeInSeconds || 0) / 60)}{' '}
                minutes
              </small>
              <small>Servings: {recipe.servings || 'N/A'}</small>
            </div>
            <div className="recipe-card-menu">
              <FaEllipsisV />
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => handleViewClick(recipe)}
                >
                  <FaEye /> View
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleEditClick(recipe)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="plus-card" onClick={() => setIsCreateModalOpen(true)}>
          <FaPlus size={50} color="white" />
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateRecipe
          onCreate={handleAddRecipe}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isViewModalOpen && viewRecipe && (
        <ViewRecipes recipe={viewRecipe} onClose={handleCloseViewModal} />
      )}

      {isEditModalOpen && editRecipe && (
        <EditRecipes
          recipe={editRecipe}
          onUpdate={handleUpdateRecipe}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default Recipes;