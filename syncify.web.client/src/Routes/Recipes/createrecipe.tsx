import { RecipesService } from '../../api/generated/RecipesService';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import React, { useState, useEffect } from 'react';
import {
    RecipeCreateDto,
    RecipeIngredientCreateDto
} from '../../api/generated/index.defs';
import './recipe.css';
import { useAsyncFn } from 'react-use';
import { FaExclamationCircle, FaCheckCircle, FaPlusCircle, FaTrash, FaArrowLeft, FaTimesCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

interface IngredientWithId extends RecipeIngredientCreateDto {
    id: number;
}

const CreateRecipe: React.FC = () => {
    const navigate = useNavigate();

    const [newRecipe, setNewRecipe] = useState<RecipeCreateDto>({
        name: '',
        description: '',
        instructions: '',
        prepTimeInSeconds: undefined,
        cookTimeInSeconds: undefined,
        servings: undefined,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [ingredientErrors, setIngredientErrors] = useState<{ [key: string]: string }>({});
    const [createdRecipeId, setCreatedRecipeId] = useState<number | null>(null);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        quantity: 0,
        unit: '',
    });
    const [ingredients, setIngredients] = useState<IngredientWithId[]>([]);
    const [recipeCreated, setRecipeCreated] = useState(false);
    const [ingredientsAdded, setIngredientsAdded] = useState(false);

    const [showIngredientDeleteModal, setShowIngredientDeleteModal] = useState(false);
    const [ingredientToDeleteId, setIngredientToDeleteId] = useState<number | null>(null);

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

        if (response && response.data) {
            setErrors({});
            setCreatedRecipeId(response.data.id);
            toast.success('Recipe created successfully!');
            setRecipeCreated(true);
        } else if (response && response.errors) {
            const fieldErrors = response.errors.reduce(
                (acc: { [key: string]: string }, error: any) => {
                    acc[error.propertyName.toLowerCase()] = error.errorMessage;
                    return acc;
                },
                {}
            );
            setErrors(fieldErrors);
            toast.error('Failed to create recipe!');
        }
    }, [newRecipe]);

    const [addIngredientState, handleAddIngredient] = useAsyncFn(async () => {
        if (!createdRecipeId) return;

        const ingredientToCreate = { ...newIngredient, recipeId: createdRecipeId };

        const response = await RecipeIngredientService.create({
            body: ingredientToCreate,
        });

        if (response && response.data) {
            const { id, ...restData } = response.data;
            setIngredientErrors({});
            setIngredients((prevIngredients) => [
                ...prevIngredients,
                { id, ...restData } as IngredientWithId,
            ]);
            setNewIngredient({ name: '', quantity: 0, unit: '' });
            toast.success('Ingredient added successfully!');
        } else if (response && response.errors) {
            const fieldErrors = response.errors.reduce(
                (acc: { [key: string]: string }, error: any) => {
                    acc[error.propertyName.toLowerCase()] = error.errorMessage;
                    return acc;
                },
                {}
            );
            setIngredientErrors(fieldErrors);
            toast.error('Failed to add ingredient!');
        } else {
            toast.error('Unexpected error during ingredient addition!');
        }
    }, [newIngredient, createdRecipeId]);

    const handleDone = () => {
        setIngredientsAdded(true);
        setCreatedRecipeId(null);
        navigate('/recipes');
    };

    const handleInitiateDeleteIngredient = (ingredientId: number) => {
        setIngredientToDeleteId(ingredientId);
        setShowIngredientDeleteModal(true);
    }

    const handleDeleteIngredient = async () => {
        if (ingredientToDeleteId === null) return;

        try {
            const response = await RecipeIngredientService.delete({ id: ingredientToDeleteId });

            if (response) {
                setIngredients((prevIngredients) =>
                    prevIngredients.filter((ingredient) => ingredient.id !== ingredientToDeleteId)
                );
                toast.success('Ingredient deleted successfully!');
            } else {
                toast.error('Failed to delete ingredient!');
            }
        } catch (error) {
            toast.error('Failed to delete ingredient!');
        } finally {
            setShowIngredientDeleteModal(false);
            setIngredientToDeleteId(null);
        }
    };

    const [units] = useState<string[]>([
        'Count', 'Teaspoon', 'Tablespoon', 'Cup', 'Pint', 'Quart', 'Gallon', 'Milliliter', 'Liter', 'Ounce', 'Pound', 'Gram', 'Kilogram', 'Milligram', 'Pinch', 'Dash', 'FluidOunce', 'Piece',
    ]);

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="d-flex justify-content-start align-items-center mb-3">
                <button className="btn btn-success btn-sm" onClick={() => navigate('/recipes')}>
                    <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Recipe List
                </button>
            </div>
            <h2 className="text-center text-highlight mb-4">Create New Recipe</h2>
            <div className="form-container mx-auto p-5 shadow-lg rounded" style={{ maxWidth: '800px', backgroundColor: '#f7f9fa' }}>
                {!recipeCreated && (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Recipe Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={newRecipe.name}
                                onChange={(e) => setNewRecipe((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            {errors.name && (
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {errors.name}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                value={newRecipe.description}
                                onChange={(e) => setNewRecipe((prev) => ({ ...prev, description: e.target.value }))}
                            />
                            {errors.description && (
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {errors.description}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Instructions</label>
                            <textarea
                                className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                                value={newRecipe.instructions}
                                onChange={(e) => setNewRecipe((prev) => ({ ...prev, instructions: e.target.value }))}
                            />
                            {errors.instructions && (
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {errors.instructions}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Prep Time (minutes)</label>
                            <input
                                type="number"
                                className={`form-control ${errors.preptimeinseconds ? 'is-invalid' : ''}`}
                                min="0"
                                value={newRecipe.prepTimeInSeconds !== undefined ? newRecipe.prepTimeInSeconds / 60 : ''}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0) {
                                        setNewRecipe((prev) => ({ ...prev, prepTimeInSeconds: value * 60 }));
                                    }
                                }}
                            />
                            {errors.preptimeinseconds && (
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {errors.preptimeinseconds}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Cook Time (minutes)</label>
                            <input
                                type="number"
                                className={`form-control ${errors.cooktimeinseconds ? 'is-invalid' : ''}`}
                                min="0"
                                value={newRecipe.cookTimeInSeconds !== undefined ? newRecipe.cookTimeInSeconds / 60 : ''}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0) {
                                        setNewRecipe((prev) => ({ ...prev, cookTimeInSeconds: value * 60 }));
                                    }
                                }}
                            />
                            {errors.cooktimeinseconds && (
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {errors.cooktimeinseconds}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Servings</label>
                            <input
                                type="number"
                                className={`form-control ${errors.servings ? 'is-invalid' : ''}`}
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
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {errors.servings}
                                </div>
                            )}
                        </div>
                        {errors.general && (
                            <div className="alert alert-danger">{errors.general}</div>
                        )}
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary" onClick={handleCreateRecipe}>
                                <FaCheckCircle style={{ marginRight: '5px' }} /> Create Recipe
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                <FaTimesCircle style={{ marginRight: '5px' }} /> Cancel
                            </button>
                        </div>
                    </div>
                )}
                {recipeCreated && (
                    <div>
                        <h3 className="mb-4">Add Ingredients to Recipe</h3>
                        <ul className="list-group mb-3">
                            {ingredients.map((ingredient, index) => (
                                <li key={ingredient.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</span>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleInitiateDeleteIngredient(ingredient.id)}>
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="mb-3">
                            <label className="form-label">Ingredient Name</label>
                            <input
                                type="text"
                                className={`form-control ${ingredientErrors.name ? 'is-invalid' : ''}`}
                                placeholder="Ingredient Name"
                                value={newIngredient.name}
                                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                            />
                            {ingredientErrors.name && (
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {ingredientErrors.name}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className={`form-control ${ingredientErrors.quantity ? 'is-invalid' : ''}`}
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
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {ingredientErrors.quantity}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Unit</label>
                            <select
                                value={newIngredient.unit}
                                onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                                className={`form-select ${ingredientErrors.unit ? 'is-invalid' : ''}`}
                            >
                                <option value="">Select unit</option>
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                            {ingredientErrors.unit && (
                                <div className="invalid-feedback">
                                    <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                                    {ingredientErrors.unit}
                                </div>
                            )}
                        </div>
                        <div className="d-grid gap-2 mb-3">
                            <button className="btn btn-primary" onClick={handleAddIngredient}>
                                <FaPlusCircle style={{ marginRight: '5px' }} /> Add Ingredient
                            </button>
                            <button className="btn btn-secondary" onClick={handleDone}>
                                <FaCheckCircle style={{ marginRight: '5px' }} /> Done
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal show={showIngredientDeleteModal} onHide={() => setShowIngredientDeleteModal(false)} centered>
                <Modal.Header>
                    <Modal.Title>Delete Ingredient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this ingredient? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowIngredientDeleteModal(false)}>
                        <FaTimesCircle style={{ marginRight: '5px' }} /> Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteIngredient}>
                        <FaTrash style={{ marginRight: '5px' }} /> Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateRecipe;