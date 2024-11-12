import React, { useState, useEffect } from 'react';
import './recipe.css';
import './../../index.css';
import { RecipesService } from '../../api/generated/RecipesService';
import { RecipieIngredientService } from '../../api/generated/RecipieIngredientService';
import {
  RecipeGetDto,
  RecipeCreateDto,
  RecipeIngredientGetDto,
  RecipeIngredientCreateDto,
} from '../../api/generated/index.defs';
import { useAsync } from 'react-use';
import Syncify from '../../Images/Syncify.png';
import { useUser } from '../../auth/auth-context';
import { FaEllipsisV, FaEye, FaEdit, FaTrashAlt, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const Recipes = () => {
  const [recipes, setRecipes] = useState<RecipeGetDto[]>([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<RecipeGetDto | null>(
    null
  );
  const [newRecipe, setNewRecipe] = useState<RecipeCreateDto>({
    name: '',
    description: '',
    prepTimeInSeconds: undefined,
    cookTimeInSeconds: undefined,
    servings: undefined,
  });

  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [createdRecipeId, setCreatedRecipeId] = useState<number | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [recipeOfTheDayIngredients, setRecipeOfTheDayIngredients] = useState<
    RecipeIngredientGetDto[]
  >([]);
  const [editRecipe, setEditRecipe] = useState<RecipeGetDto | undefined>(
    undefined
  );
  const [viewRecipe, setViewRecipe] = useState<RecipeGetDto | undefined>(
    undefined
  );
  const [ingredients, setIngredients] = useState<RecipeIngredientGetDto[]>([]);
  const [currentEditIngredient, setCurrentEditIngredient] =
    useState<RecipeIngredientGetDto | null>(null);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    description: '',
    quantity: 0,
    unit: '',
  });
  const user = useUser();
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

  useEffect(() => {
    const fetchRecipeOfTheDay = async () => {
      const recipeOfTheDayResponse = await RecipesService.getRecipeOfTheDay();
      const recipe = recipeOfTheDayResponse.data || null;
      setRecipeOfTheDay(recipe);

      if (recipe) {
        const ingredientsResponse = await RecipieIngredientService.getAll({
          recipeId: recipe.id,
        });
        const ingredientsData = Array.isArray(ingredientsResponse)
          ? ingredientsResponse
          : ingredientsResponse?.data || [];
        setRecipeOfTheDayIngredients(ingredientsData);
      }
    };

    fetchRecipeOfTheDay();
  }, []);

  const { loading, error } = useAsync(async () => {
    if (!user?.id) return;

    const recipeOfTheDayResponse = await RecipesService.getRecipeOfTheDay();
    setRecipeOfTheDay(recipeOfTheDayResponse.data || null);

    const response = await RecipesService.getRecipesByUserId({
      userId: user.id,
    });
    setRecipes(response.data?.filter(Boolean) || []);
  }, [user?.id]);

  const handleViewClick = (recipe) => {
    setViewRecipe(recipe);
    setIsViewModalOpen(true);

    RecipieIngredientService.getAll({ recipeId: recipe.id }).then(
      (ingredientsResponse) => {
        const ingredientsData = Array.isArray(ingredientsResponse)
          ? ingredientsResponse
          : ingredientsResponse?.data || [];
        setIngredients(ingredientsData);
      }
    );
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewRecipe(undefined);
  };

  const handleEditClick = (recipe) => {
        setEditRecipe(recipe);
        setIsEditModalOpen(true);

        RecipieIngredientService.getAll({ recipeId: recipe.id }).then((ingredientsResponse) => {
            const ingredientsData = Array.isArray(ingredientsResponse)
                ? ingredientsResponse
                : ingredientsResponse?.data || [];
            setIngredients(ingredientsData);
        });
    };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditRecipe((prevRecipe) => {
      if (!prevRecipe) return undefined;

      return {
        ...prevRecipe,
        [name]: name.includes('Time') ? Number(value) * 60 : value || '',
      } as RecipeGetDto;
    });
  };

    const handleUpdateRecipe = () => {
        if (!editRecipe) return;

        RecipesService.updateRecipe({
            id: editRecipe.id,
            body: editRecipe,
        }).then((response) => {
            if (response && response.data) {
                setRecipes((prevRecipes) =>
                    prevRecipes
                        .map((recipe) =>
                            recipe.id === editRecipe.id ? response.data : recipe
                        )
                        .filter((recipe): recipe is RecipeGetDto => recipe !== null)
                );
                setIsEditModalOpen(false);
                setEditRecipe(undefined);
            }
        });
    };

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
    setIngredients([]);
  };

  const handleCreateRecipe = async () => {
    const recipeToCreate = {
      ...newRecipe,
      prepTimeInSeconds: (newRecipe.prepTimeInSeconds ?? 0) * 60,
      cookTimeInSeconds: (newRecipe.cookTimeInSeconds ?? 0) * 60,
    };

    const response = await RecipesService.createRecipe({
      body: recipeToCreate,
    });

    if (response && response.data) {
      setCreatedRecipeId(response.data.id);
      setIsModalOpen(false);
      setIsIngredientModalOpen(true);
    }

    setNewRecipe({
      name: '',
      description: '',
      prepTimeInSeconds: undefined,
      cookTimeInSeconds: undefined,
      servings: undefined,
    });
  };

  const handleAddIngredient = () => {
    const recipeId = createdRecipeId || editRecipe?.id;
    if (
      !recipeId ||
      !newIngredient.name ||
      !newIngredient.quantity ||
      !newIngredient.unit
    )
      return;

    const ingredientToCreate: RecipeIngredientCreateDto = {
      recipeId: recipeId,
      name: newIngredient.name,
      description: newIngredient.description,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit,
    };

    RecipieIngredientService.create({ body: ingredientToCreate })
      .then((response) => {
        setIngredients((prev) =>
          [...prev, response.data].filter(
            (item): item is RecipeIngredientGetDto => item !== null
          )
        );
        setNewIngredient({ name: '', description: '', quantity: 0, unit: '' });
      })
  };

  const handleEditIngredient = (ingredient) => {
    setCurrentEditIngredient(ingredient);
  };

  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditIngredient((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleUpdateIngredient = (ingredientId, updatedData) => {
    RecipieIngredientService.update({
      id: ingredientId,
      body: updatedData,
    }).then((response) => {
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
      }
    });
  };

  const handleDeleteIngredient = async (ingredientId) => {
    await RecipieIngredientService.delete({ id: ingredientId });
    setIngredients((prev) =>
      prev.filter((ingredient) => ingredient?.id !== ingredientId)
    );
  };

  const handleDeleteRecipe = (recipeId) => {
    RecipesService.deleteRecipe({ id: recipeId })
      .then(() => {
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== recipeId)
        );
      })
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipes.</div>;

  return (
    <div className="page-content">
      <h2 className="text-center text-highlight mb-4">My Recipes</h2>
      <div className="recipe-of-the-day-container">
        <div className="recipe-of-the-day-wrapper">
          <h3 className="recipe-of-the-day-title text-center">
            Recipe of the Day
          </h3>
          <div className="recipe-of-the-day-card">
            <img
              src={Syncify}
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
        {recipes.map(
          (recipe) =>
            recipe && (
              <div className="recipe-card" key={recipe?.id}>
                <img
                  src={Syncify}
                  alt="Recipe Image"
                  className="recipe-image"
                />
                <div className="recipe-card-content">
                  <h4>{recipe?.name || 'Unnamed Recipe'}</h4>
                  <p>
                    {recipe?.description
                      ? recipe.description.length > 100
                        ? `${recipe.description.substring(0, 100)}...`
                        : recipe.description
                      : 'No description available'}
                  </p>
                  <small>
                    Prep Time:{' '}
                    {Math.round((recipe?.prepTimeInSeconds || 0) / 60)} minutes
                  </small>
                  <small>
                    Cook Time:{' '}
                    {Math.round((recipe?.cookTimeInSeconds || 0) / 60)} minutes
                  </small>
                  <small>Servings: {recipe?.servings || 'N/A'}</small>
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
            )
        )}
        <div className="plus-card" onClick={handleOpenCreateModal}>
          <FaPlus size={50} color="white" />
        </div>
      </div>
      {isViewModalOpen && viewRecipe && (
        <div className="modal-overlay" onClick={handleCloseViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{viewRecipe.name}</h3>
            <p>{viewRecipe.description}</p>
            <p>
              Prep Time: {Math.round((viewRecipe.prepTimeInSeconds || 0) / 60)}{' '}
              minutes
            </p>
            <p>
              Cook Time: {Math.round((viewRecipe.cookTimeInSeconds || 0) / 60)}{' '}
              minutes
            </p>
            <p>Servings: {viewRecipe.servings}</p>
            <h4>Ingredients</h4>
            <ul>
              {ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </li>
                ))
              ) : (
                <p>No ingredients available</p>
              )}
            </ul>
            <button onClick={handleCloseViewModal} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Recipe</h3>

            <label>Recipe Name</label>
            <input
              type="text"
              name="name"
              value={newRecipe.name}
              onChange={(e) =>
                setNewRecipe((prev) => ({ ...prev, name: e.target.value }))
              }
              className="form-control mb-2"
            />
            <label>Description</label>
            <textarea
              name="description"
              value={newRecipe.description}
              onChange={(e) =>
                setNewRecipe((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="form-control mb-2"
            />
            <label>Prep Time (minutes)</label>
            <input
              type="number"
              name="prepTimeInSeconds"
              value={newRecipe.prepTimeInSeconds || ''}
              onChange={(e) =>
                setNewRecipe((prev) => ({
                  ...prev,
                  prepTimeInSeconds: e.target.value
                    ? Number(e.target.value)
                    : null,
                }))
              }
              className="form-control mb-2"
            />
            <label>Cook Time (minutes)</label>
            <input
              type="number"
              name="cookTimeInSeconds"
              value={newRecipe.cookTimeInSeconds || ''}
              onChange={(e) =>
                setNewRecipe((prev) => ({
                  ...prev,
                  cookTimeInSeconds: e.target.value
                    ? Number(e.target.value)
                    : null,
                }))
              }
              className="form-control mb-2"
            />
            <label>Servings</label>
            <input
              type="number"
              name="servings"
              value={newRecipe.servings || ''}
              onChange={(e) =>
                setNewRecipe((prev) => ({
                  ...prev,
                  servings: Number(e.target.value),
                }))
              }
              className="form-control mb-2"
            />
            <button onClick={handleCreateRecipe} className="btn btn-primary">
              Create Recipe
            </button>
          </div>
        </div>
      )}

      {isViewModalOpen && viewRecipe && (
        <div className="modal-overlay" onClick={handleCloseViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{viewRecipe.name}</h3>
            <p>{viewRecipe.description}</p>
            <p>
              Prep Time: {Math.round((viewRecipe.prepTimeInSeconds || 0) / 60)}{' '}
              minutes
            </p>
            <p>
              Cook Time: {Math.round((viewRecipe.cookTimeInSeconds || 0) / 60)}{' '}
              minutes
            </p>
            <p>Servings: {viewRecipe.servings}</p>
            <h4>Ingredients</h4>
            <ul>
              {ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </li>
              ))}
            </ul>
            <button onClick={handleCloseViewModal} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && editRecipe && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Recipe</h3>
            <label>Recipe Name</label>
            <input
              type="text"
              name="name"
              value={editRecipe?.name || ''}
              onChange={handleEditInputChange}
              className="form-control mb-2"
            />

            <label>Description</label>
            <textarea
              name="description"
              value={editRecipe?.description || ''}
              onChange={handleEditInputChange}
              className="form-control mb-2"
            />

            <label>Prep Time (minutes)</label>
            <input
              type="number"
              name="prepTimeInSeconds"
              value={
                editRecipe?.prepTimeInSeconds
                  ? editRecipe.prepTimeInSeconds / 60
                  : ''
              }
              onChange={(e) =>
                setEditRecipe({
                  ...editRecipe,
                  prepTimeInSeconds: e.target.value
                    ? Number(e.target.value) * 60
                    : undefined,
                })
              }
              className="form-control mb-2"
            />

            <label>Cook Time (minutes)</label>
            <input
              type="number"
              name="cookTimeInSeconds"
              value={
                editRecipe?.cookTimeInSeconds
                  ? editRecipe.cookTimeInSeconds / 60
                  : ''
              }
              onChange={(e) =>
                setEditRecipe({
                  ...editRecipe,
                  cookTimeInSeconds: e.target.value
                    ? Number(e.target.value) * 60
                    : undefined,
                })
              }
              className="form-control mb-2"
            />

            <label>Servings</label>
            <input
              type="number"
              name="servings"
              value={editRecipe?.servings || ''}
              onChange={handleEditInputChange}
              className="form-control mb-2"
            />

            <h4>Ingredients</h4>
            <ul>
              {ingredients.map(
                (ingredient) =>
                  ingredient && (
                    <li key={ingredient?.id}>
                      {currentEditIngredient?.id === ingredient.id ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            value={currentEditIngredient.name}
                            onChange={handleIngredientChange}
                          />
                          <input
                            type="number"
                            name="quantity"
                            value={currentEditIngredient.quantity}
                            onChange={handleIngredientChange}
                          />
                          <input
                            type="text"
                            name="unit"
                            value={currentEditIngredient.unit}
                            onChange={handleIngredientChange}
                          />
                           <div className="icon-group">
                             <button
                              className="icon-update"
                              onClick={() =>
                               handleUpdateIngredient(ingredient.id, {
                                ...ingredient,
                                quantity: currentEditIngredient?.quantity,
                                })
                               }
                              >
                               <FaCheck />
                             </button>

                            <button
                              className="icon-cancel"
                              onClick={() => setCurrentEditIngredient(null)}
                             >
                               <FaTimes />
                            </button>
                            </div>
                        </>
                      ) : (
                        <div className="ingredient-item">
                          <span>
                            {ingredient?.name || 'Unnamed Ingredient'} -{' '}
                            {ingredient?.quantity || 'Unknown Quantity'}{' '}
                            {ingredient?.unit || 'No Unit'}
                          </span>
                          <div className="icon-group">
                            <button
                              onClick={() => handleEditIngredient(ingredient)}
                              className="icon-button"
                            >
                              <FaEdit className="icon edit-icon" /> Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteIngredient(ingredient.id)
                              }
                              className="icon-button"
                            >
                              <FaTrashAlt className="icon delete-icon" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  )
              )}
            </ul>

            <div className="ingredient-input-container">
              <label>Ingredient Name</label>
              <input
                type="text"
                placeholder="Ingredient Name"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
              />

              <label>Description</label>
              <input
                type="text"
                placeholder="Description"
                value={newIngredient.description}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    description: e.target.value,
                  })
                }
              />

              <label>Quantity</label>
              <input
                type="number"
                placeholder="Quantity"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: Number(e.target.value),
                  })
                }
              />

              <label>Unit</label>
              <input
                type="text"
                placeholder="Unit"
                value={newIngredient.unit}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, unit: e.target.value })
                }
              />
              <h4>Available Units:</h4>
              <p>{availableUnits.join(', ')}</p>

              <button
                onClick={handleAddIngredient}
                className="add-ingredient-button"
              >
                Add Ingredient
              </button>
            </div>

            <button onClick={handleUpdateRecipe} className="btn btn-primary">
              Update Recipe
            </button>
          </div>
        </div>
      )}

      {isViewModalOpen && viewRecipe && (
        <div
          className="modal-overlay"
          key={viewRecipe.id + ingredients.length}
          onClick={handleCloseViewModal}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{viewRecipe.name}</h3>
            <p>{viewRecipe.description}</p>
            <p>
              Prep Time: {Math.round((viewRecipe.prepTimeInSeconds || 0) / 60)}{' '}
              minutes
            </p>
            <p>
              Cook Time: {Math.round((viewRecipe.cookTimeInSeconds || 0) / 60)}{' '}
              minutes
            </p>
            <p>Servings: {viewRecipe.servings}</p>
            <h4>Ingredients</h4>
            <ul>
              {ingredients && ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </li>
                ))
              ) : (
                <p>No ingredients available</p>
              )}
            </ul>
            <button onClick={handleCloseViewModal} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      )}
      {isIngredientModalOpen && createdRecipeId && (
        <div
          className="modal-overlay"
          onClick={() => setIsIngredientModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Ingredients to Recipe</h3>

            <ul>
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </span>
                  <FaTrashAlt
                    className="trash-icon"
                    onClick={() => handleDeleteIngredient(ingredient.id)}
                    style={{ cursor: 'pointer', color: '#d9534f' }}
                  />
                </li>
              ))}
            </ul>

            <div className="ingredient-input-container">
              <label>Ingredient Name</label>
              <input
                type="text"
                placeholder="Ingredient Name"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
              />

              <label>Description</label>
              <input
                type="text"
                placeholder="Description"
                value={newIngredient.description}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    description: e.target.value,
                  })
                }
              />

              <label>Quantity</label>
              <input
                type="number"
                placeholder="Quantity"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: Number(e.target.value),
                  })
                }
              />

              <label>Unit</label>
              <input
                type="text"
                placeholder="Unit"
                value={newIngredient.unit}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, unit: e.target.value })
                }
              />
              <h4>Available Units:</h4>
              <p>{availableUnits.join(', ')}</p>
              <button
                onClick={() => handleAddIngredient()}
                className="add-ingredient-button"
              >
                Add Ingredient
              </button>
            </div>

            <button
              onClick={() => setIsIngredientModalOpen(false)}
              className="btn btn-primary"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;