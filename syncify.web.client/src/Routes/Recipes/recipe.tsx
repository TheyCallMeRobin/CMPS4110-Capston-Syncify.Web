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
import { FaEllipsisV, FaEye, FaEdit, FaTrashAlt, FaPlusSquare } from 'react-icons/fa';
import image from '../../Images/Feast.png';
import { useAsyncFn } from 'react-use';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
    const [recipes, setRecipes] = useState<RecipeGetDto[]>([]);
    const [recipeOfTheDay, setRecipeOfTheDay] = useState<RecipeGetDto | null>(null);
    const [recipeOfTheDayIngredients, setRecipeOfTheDayIngredients] = useState<RecipeIngredientGetDto[]>([]);
    const [deleteModal, setDeleteModal] = useState({ show: false, recipeId: null as number | null });
    const user = useUser();
    const navigate = useNavigate();

    const [fetchRecipesState, fetchRecipes] = useAsyncFn(async () => {
        if (!user?.id) return;
        const response = await RecipesService.getRecipesByUserId({
            userId: user.id,
        });
        setRecipes(response.data || []);
    }, [user?.id]);

    const [fetchRecipeOfTheDayState, fetchRecipeOfTheDay] = useAsyncFn(async () => {
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

    const handleEditClick = (recipe: RecipeGetDto) => {
        navigate(`/edit-recipe/${recipe.id}`);
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
            setDeleteModal({ show: false, recipeId: null });
            return 'Recipe deleted successfully!';
        },
        [recipes]
    );

    useEffect(() => {
        if (deleteRecipeState.value) {
            toast.success(deleteRecipeState.value);
            deleteRecipeState.value = undefined;
        }
    }, [deleteRecipeState.value]);

    useEffect(() => {
        if (deleteRecipeState.error) {
            const errorMessage = (deleteRecipeState.error as any)?.errors?.[0]?.errorMessage || deleteRecipeState.error.message || 'Failed to delete recipe. Please try again.';
            toast.error(errorMessage);
        }
    }, [deleteRecipeState.error]);

    return (
        <div className="page-content">
            <ToastContainer />
            <h2 className="text-center text-highlight mb-4">My Recipes</h2>
            <div className="recipe-of-the-day-container">
                <div className="recipe-of-the-day-wrapper">
                    <h3 className="recipe-of-the-day-title text-center">Recipe of the Day</h3>
                    <div className="recipe-of-the-day-card">
                        <img src={image} alt="Recipe of the Day" className="recipe-of-the-day-image" />
                        <div className="recipe-of-the-day-content">
                            <h4>{recipeOfTheDay?.name || 'No Recipe'}</h4>
                            <p>{recipeOfTheDay?.description || 'No description available'}</p>
                            <small>Prep Time: {Math.round((recipeOfTheDay?.prepTimeInSeconds || 0) / 60)} minutes</small>
                            <small>Cook Time: {Math.round((recipeOfTheDay?.cookTimeInSeconds || 0) / 60)} minutes</small>
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
                            <small>Prep Time: {Math.round((recipe.prepTimeInSeconds || 0) / 60)} minutes</small>
                            <small>Cook Time: {Math.round((recipe.cookTimeInSeconds || 0) / 60)} minutes</small>
                            <small>Servings: {recipe.servings || 'N/A'}</small>
                        </div>
                        <div className="recipe-card-menu">
                            <Dropdown>
                                <Dropdown.Toggle as="div" className="recipe-card-menu-icon">
                                    <FaEllipsisV />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => navigate(`/view-recipe/${recipe.id}`)}>
                                        <FaEye style={{ marginRight: '10px', color: 'blue' }} />
                                        View
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleEditClick(recipe)}>
                                        <FaEdit style={{ marginRight: '10px', color: 'green' }} />
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => setDeleteModal({ show: true, recipeId: recipe.id })}
                                        className="text-danger"
                                    >
                                        <FaTrashAlt style={{ marginRight: '10px', color: 'red' }} />
                                        Delete
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                ))}
                <div className="recipe-add" onClick={() => navigate('/create-recipe')}>
                    <FaPlusSquare className="add-icon" />
                </div>
            </div>

            <Modal show={deleteModal.show} onHide={() => setDeleteModal({ show: false, recipeId: null })} centered>
                <Modal.Header>
                    <Modal.Title>Delete Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this recipe? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModal({ show: false, recipeId: null })}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            if (deleteModal.recipeId) handleDeleteRecipe(deleteModal.recipeId);
                        }}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Recipes;