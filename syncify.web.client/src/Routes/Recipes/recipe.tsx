import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import RecipeList from './recipelist';
import RecipeModal from './recipemodal';
import RecipeCreateModal from './recipecreatemodal';
import {
    RecipeGetDto,
    RecipeCreateDto,
    RecipeIngredientCreateDto,
    RecipeTagCreateDto,
} from '../../api/generated/index.defs.ts';
import { RecipesService } from '../../api/generated/RecipesService.ts';
import { RecipieIngredientService } from '../../api/generated/RecipieIngredientService.ts';
import { RecipeTagsService } from '../../api/generated/RecipeTagsService.ts';
import { useUser } from '../../auth/auth-context.tsx';
import { useAsyncFn } from 'react-use';

export const Recipes: React.FC = () => {
    const [recipes, setRecipes] = useState<RecipeGetDto[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeGetDto | null>(
        null
    );
    const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [prepTime, setPrepTime] = useState<number | null>(null);
    const [cookTime, setCookTime] = useState<number | null>(null);
    const [servings, setServings] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useUser();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecipesFn = async () => {
        if (!user?.id) return [];

        setLoading(true);
        setError(null);
        try {
            const response = await RecipesService.getRecipes({
                name: searchTerm,
                description: searchTerm,
                prepTime: prepTime || undefined,
                cookTime: cookTime || undefined,
                servings: servings || undefined,
            });

            setRecipes(response.data || []);
        } catch (err) {
            setError('Failed to fetch recipes.');
        } finally {
            setLoading(false);
        }
    };

    const [fetchRecipesState, fetchRecipesRetry] = useAsyncFn(fetchRecipesFn, [
        searchTerm,
        prepTime,
        cookTime,
        servings,
        user?.id,
    ]);

    useEffect(() => {
        fetchRecipesRetry();
    }, [fetchRecipesRetry]);

    const handleCreateRecipe = async (
        newRecipe: RecipeCreateDto,
        ingredients: RecipeIngredientCreateDto[],
        tags: RecipeTagCreateDto[]
    ) => {
        if (!user?.id) return;

        try {
            const recipeToCreate: RecipeCreateDto = {
                ...newRecipe,
                userId: user.id,
            };

            const recipeResponse = await RecipesService.createRecipe({
                body: recipeToCreate,
            });

            if (recipeResponse.data) {
                const createdRecipeId = recipeResponse.data.id;

                const updatedIngredients = ingredients.map((ingredient) => ({
                    ...ingredient,
                    recipeId: createdRecipeId,
                }));

                const updatedTags = tags.map((tag) => ({
                    ...tag,
                    recipeId: createdRecipeId,
                }));

                const ingredientRequests = updatedIngredients.map((ingredient) =>
                    RecipieIngredientService.create({
                        body: ingredient,
                    })
                );

                const tagRequests = updatedTags.map((tag) =>
                    RecipeTagsService.createTag({ body: tag })
                );

                await Promise.all([...ingredientRequests, ...tagRequests]);

                fetchRecipesRetry();
            }
        } catch (err) {
            setError('Failed to create the recipe.');
        }
    };

    const handleDeleteRecipe = async (recipeIdToDelete: number) => {
        try {
            await RecipesService.deleteRecipe({ id: recipeIdToDelete });
            fetchRecipesRetry();
        } catch (err) {
            setError('Failed to delete the recipe.');
        }
    };

    const openRecipeModal = (recipe: RecipeGetDto) => {
        setSelectedRecipe(recipe);
        setShowRecipeModal(true);
    };

    const closeRecipeModal = () => {
        setShowRecipeModal(false);
        setSelectedRecipe(null);
    };

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ddd',
                    padding: '20px',
                    width: '100%',
                    maxWidth: '1000px',
                    gap: '10px',
                    margin: '30px',
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <label htmlFor="searchTerm">Recipe Name / Description</label>
                    <input
                        id="searchTerm"
                        type="text"
                        placeholder="Name or Desc."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '10px',
                            fontSize: '0.85rem',
                            borderRadius: '5px',
                            width: '100%',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <label htmlFor="prepTime">Prep Time (minutes)</label>
                    <input
                        id="prepTime"
                        type="number"
                        min="0"
                        placeholder="Prep time"
                        value={prepTime === null ? '' : prepTime}
                        onChange={(e) =>
                            setPrepTime(e.target.value ? parseInt(e.target.value) : null)
                        }
                        style={{
                            padding: '10px',
                            fontSize: '0.85rem',
                            borderRadius: '5px',
                            width: '100%',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <label htmlFor="cookTime">Cook Time (minutes)</label>
                    <input
                        id="cookTime"
                        type="number"
                        min="0"
                        placeholder="Cook time"
                        value={cookTime === null ? '' : cookTime}
                        onChange={(e) =>
                            setCookTime(e.target.value ? parseInt(e.target.value) : null)
                        }
                        style={{
                            padding: '10px',
                            fontSize: '0.85rem',
                            borderRadius: '5px',
                            width: '100%',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <label htmlFor="servings">Servings (quantity)</label>
                    <input
                        id="servings"
                        type="number"
                        min="0"
                        placeholder="Servings"
                        value={servings === null ? '' : servings}
                        onChange={(e) =>
                            setServings(e.target.value ? parseInt(e.target.value) : null)
                        }
                        style={{
                            padding: '10px',
                            fontSize: '0.85rem',
                            borderRadius: '5px',
                            width: '100%',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {fetchRecipesState.loading && <div>Loading recipes...</div>}

            <Button
                style={{
                    backgroundColor: '#0b60b0',
                    margin: '10px',
                    color: 'white',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
                onClick={() => setShowModal(true)}
            >
                Create Recipe
            </Button>

            <RecipeCreateModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleCreateRecipe={(newRecipe, ingredients, tags) =>
                    handleCreateRecipe(newRecipe, ingredients, tags)
                }
                userId={user?.id || 0}
            />

            {recipes.length === 0 && !fetchRecipesState.loading && !error && (
                <div>No recipes found.</div>
            )}
            <RecipeList
                recipes={recipes}
                onRecipeClick={openRecipeModal}
                onDeleteRecipe={handleDeleteRecipe}
            />

            <RecipeModal
                show={showRecipeModal}
                onHide={closeRecipeModal}
                recipe={selectedRecipe}
                onDeleteRecipe={handleDeleteRecipe}
            />
        </div>
    );
};