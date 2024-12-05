import React, { useEffect, useState } from 'react';
import './recipe.css';
import { RecipesService } from '../../api/generated/RecipesService';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import { RecipeGetDto, RecipeIngredientGetDto, RecipeUpdateDto } from '../../api/generated/index.defs';
import EditIngredient from './editingredient';
import { useAsyncFn } from 'react-use';
import { FaArrowLeft, FaExclamationCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const EditRecipes: React.FC = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const navigate = useNavigate();
    const [editRecipe, setEditRecipe] = useState<RecipeGetDto | null>(null);
    const [ingredients, setIngredients] = useState<RecipeIngredientGetDto[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [state, fetchIngredients] = useAsyncFn(async () => {
        if (recipeId) {
            const recipeResponse = await RecipesService.getRecipeById({ id: Number(recipeId) });
            if (recipeResponse?.data) {
                setEditRecipe(recipeResponse.data);
            }

            const ingredientsResponse = await RecipeIngredientService.getAll({
                recipeId: Number(recipeId),
            });

            return Array.isArray(ingredientsResponse) ? ingredientsResponse : ingredientsResponse?.data || [];
        }
        return [];
    }, [recipeId]);

    const [updateRecipeState, handleUpdateRecipe] = useAsyncFn(async () => {
        if (!editRecipe) return;

        const updatePayload: RecipeUpdateDto = {
            name: editRecipe.name,
            description: editRecipe.description,
            instructions: editRecipe.instructions,
            prepTimeInSeconds: editRecipe.prepTimeInSeconds,
            cookTimeInSeconds: editRecipe.cookTimeInSeconds,
            servings: editRecipe.servings,
        };

        const response = await RecipesService.updateRecipe({
            id: editRecipe.id,
            body: updatePayload,
        });

        if (response?.data) {
            setErrors({});
            toast.success('Recipe updated successfully!');
            navigate('/recipes');

        } else if (response?.errors) {
            const fieldErrors = response.errors.reduce<{ [key: string]: string }>((acc, error) => {
                acc[error.propertyName.toLowerCase()] = error.errorMessage;
                return acc;
            }, {});
            setErrors(fieldErrors);
        }
    }, [editRecipe]);

    const [addIngredientState, handleAddIngredient] = useAsyncFn(async (newIngredient: Omit<RecipeIngredientGetDto, 'id'>) => {
        if (!editRecipe) return { errors: [{ errorMessage: 'No recipe selected', propertyName: '' }] };

        const ingredientToCreate = { ...newIngredient, recipeId: editRecipe.id };
        const response = await RecipeIngredientService.create({
            body: ingredientToCreate,
        });

        if (response?.data) {
            setIngredients((prev) => [...prev, response.data as RecipeIngredientGetDto]);
            return { data: response.data };
        }

        return { errors: response.errors || [{ errorMessage: 'Unknown error occurred', propertyName: '' }] };
    }, [editRecipe]);

    const handleUpdateIngredient = async (ingredientId: number, updatedIngredient: RecipeIngredientGetDto) => {
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
                    .filter((ingredient): ingredient is RecipeIngredientGetDto => ingredient !== null)
            );
            return { data: response.data };
        }

        return { errors: response.errors || [{ errorMessage: 'Unknown error occurred', propertyName: '' }] };
    };

    const [deleteIngredientState, handleDeleteIngredient] = useAsyncFn(async (ingredientId: number) => {
        const response = await RecipeIngredientService.delete({
            id: ingredientId,
        });

        if (response) {
            setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== ingredientId));
            return { data: response };
        } else {
            return {
                errors: [{ errorMessage: 'Error deleting ingredient', propertyName: '' }],
            };
        }
    }, []);

    useEffect(() => {
        fetchIngredients().then((ingredientsData) => {
            setIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
        });
    }, [fetchIngredients]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editRecipe) return;
        const { name, value } = e.target;
        setEditRecipe((prevRecipe) => {
            if (!prevRecipe) return null;
            return {
                ...prevRecipe,
                [name]: name === 'prepTimeInSeconds' || name === 'cookTimeInSeconds' ? Number(value) * 60 : value
            };
        });
    };

    if (!editRecipe) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="d-flex justify-content-start align-items-center mb-4">
                <button className="btn btn-success btn-sm" onClick={() => navigate('/recipes')}>
                    <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Recipe List
                </button>
            </div>
            <h2 className="text-center text-highlight mb-4">Edit Recipe</h2>
            <div className="form-container mx-auto p-5 shadow-lg rounded" style={{ maxWidth: '800px', backgroundColor: '#f7f9fa' }}>
                <div className="mb-4 p-4 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
                    <h5 className="mb-3">Recipe Name</h5>
                    <input
                        type="text"
                        name="name"
                        value={editRecipe.name}
                        onChange={handleInputChange}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">
                            <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                            {errors.name}
                        </div>
                    )}
                </div>
                <div className="mb-4 p-4 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
                    <h5 className="mb-3">Description</h5>
                    <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        name="description"
                        value={editRecipe.description || ''}
                        onChange={handleInputChange}
                    />
                    {errors.description && (
                        <div className="invalid-feedback">
                            <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                            {errors.description}
                        </div>
                    )}
                </div>
                <div className="mb-4 p-4 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
                    <h5 className="mb-3">Instructions</h5>
                    <textarea
                        className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                        name="instructions"
                        value={editRecipe.instructions || ''}
                        onChange={handleInputChange}
                    />
                    {errors.instructions && (
                        <div className="invalid-feedback">
                            <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                            {errors.instructions}
                        </div>
                    )}
                </div>
                <div className="mb-4 p-4 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
                    <h5 className="mb-3">Prep Time (minutes)</h5>
                    <input
                        type="number"
                        name="prepTimeInSeconds"
                        value={editRecipe.prepTimeInSeconds ? editRecipe.prepTimeInSeconds / 60 : ''}
                        onChange={handleInputChange}
                        className={`form-control ${errors.preptimeinseconds ? 'is-invalid' : ''}`}
                        min="0"
                    />
                    {errors.preptimeinseconds && (
                        <div className="invalid-feedback">
                            <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                            {errors.preptimeinseconds}
                        </div>
                    )}
                </div>
                <div className="mb-4 p-4 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
                    <h5 className="mb-3">Cook Time (minutes)</h5>
                    <input
                        type="number"
                        name="cookTimeInSeconds"
                        value={editRecipe.cookTimeInSeconds ? editRecipe.cookTimeInSeconds / 60 : ''}
                        onChange={handleInputChange}
                        className={`form-control ${errors.cooktimeinseconds ? 'is-invalid' : ''}`}
                        min="0"
                    />
                    {errors.cooktimeinseconds && (
                        <div className="invalid-feedback">
                            <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                            {errors.cooktimeinseconds}
                        </div>
                    )}
                </div>
                <div className="mb-4 p-4 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
                    <h5 className="mb-3">Servings</h5>
                    <input
                        type="number"
                        name="servings"
                        value={editRecipe.servings || ''}
                        onChange={handleInputChange}
                        className={`form-control ${errors.servings ? 'is-invalid' : ''}`}
                        min="0"
                    />
                    {errors.servings && (
                        <div className="invalid-feedback">
                            <FaExclamationCircle style={{ color: 'red', fontSize: '1em', marginRight: '5px' }} />
                            {errors.servings}
                        </div>
                    )}
                </div>
                <div className="p-4 mb-4 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
                    <EditIngredient
                        ingredients={Array.isArray(ingredients) ? ingredients : []}
                        onAdd={handleAddIngredient}
                        onDelete={handleDeleteIngredient}
                        recipeId={editRecipe.id}
                        onUpdate={handleUpdateIngredient}
                    />
                </div>
                <div className="d-grid gap-2 mb-4">
                    <button onClick={() => handleUpdateRecipe()} className="btn btn-primary" disabled={updateRecipeState.loading}>
                        {updateRecipeState.loading ? 'Updating...' : <><FaCheckCircle style={{ marginRight: '5px' }} />Update Recipe</>}
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        <FaTimesCircle style={{ marginRight: '5px' }} />Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRecipes;