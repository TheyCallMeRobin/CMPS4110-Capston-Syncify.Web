import React, { useState } from 'react';
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
import { useAsync } from 'react-use';

export const Recipes: React.FC = () => {
    const [recipes, setRecipes] = useState<RecipeGetDto[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeGetDto | null>(null);
    const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [prepTime, setPrepTime] = useState<number | null>(null);
    const [cookTime, setCookTime] = useState<number | null>(null);
    const [servings, setServings] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const user = useUser();

    useAsync(async () => {
        if (!user?.id) return;

        const response = await RecipesService.getRecipes({
            name: searchTerm,
            description: searchTerm,
            prepTime: prepTime || undefined,
            cookTime: cookTime || undefined,
            servings: servings || undefined,
        });
        if (response.data) {
            setRecipes(response.data);
        }
    }, [searchTerm, prepTime, cookTime, servings, user?.id]);

    const handleCreateRecipe = async (
        newRecipe: RecipeCreateDto,
        ingredients: RecipeIngredientCreateDto[],
        tags: RecipeTagCreateDto[]
    ) => {
        if (!user?.id) return;

        const recipeToCreate: RecipeCreateDto = {
            ...newRecipe,
            userId: user.id,
        };

        const recipeResponse = await RecipesService.createRecipe({
            body: recipeToCreate,
        });

        if (recipeResponse.data) {
            const createdRecipeId = recipeResponse.data.id;

            const updatedIngredients = ingredients.map(ingredient => ({
                ...ingredient,
                recipeId: createdRecipeId,
            }));

            const updatedTags = tags.map(tag => ({
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

            const updatedRecipe = await RecipesService.getRecipeById({
                id: createdRecipeId,
            });

            if (updatedRecipe.data) {
                setRecipes((prevRecipes) => [...prevRecipes, updatedRecipe.data!]);
            }
        }
    };

    const handleDeleteRecipe = async (recipeIdToDelete: number) => {
        await RecipesService.deleteRecipe({ id: recipeIdToDelete });
        setRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe.id !== recipeIdToDelete)
        );
    };

    const openRecipeModal = (recipe: RecipeGetDto) => {
        setSelectedRecipe(recipe);
        setShowRecipeModal(true);
    };

    const closeRecipeModal = () => {
        setShowRecipeModal(false);
        setSelectedRecipe(null);
    };

    const filteredRecipes = recipes.filter((recipe) => {
        return (
            (searchTerm &&
                (recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    recipe.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))) ||
            (prepTime !== null &&
                prepTime > 0 &&
                recipe.prepTimeInMinutes === prepTime) ||
            (cookTime !== null &&
                cookTime > 0 &&
                recipe.cookTimeInMinutes === cookTime) ||
            (servings !== null && servings > 0 && recipe.servings === servings)
        );
    });

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Search Filters */}
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

            <Button
                style={{
                    backgroundColor: '#007BFF',
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

            <RecipeList
                recipes={filteredRecipes.length > 0 ? filteredRecipes : recipes}
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