import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import RecipeList from './recipelist';
import RecipeModal from './recipemodal';
import RecipeCreateModal from './recipecreatemodal';
import { logError } from '../../utils/logger';
import { Recipe, NewRecipe } from './Recipe';  


export const Recipes: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [prepTime, setPrepTime] = useState<number | null>(null); 
    const [cookTime, setCookTime] = useState<number | null>(null); 
    const [servings, setServings] = useState<number | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchRecipes = () => {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams();

            if (searchTerm) {
                queryParams.append('name', searchTerm);
                queryParams.append('description', searchTerm);
            }
            if (prepTime !== null) {
                queryParams.append('prepTime', prepTime.toString());
            }
            if (cookTime !== null) {
                queryParams.append('cookTime', cookTime.toString());
            }
            if (servings !== null) {
                queryParams.append('servings', servings.toString());
            }

            fetch(`/api/recipes?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => setRecipes(data.data))
                .finally(() => setLoading(false));
        };

        fetchRecipes();
    }, [searchTerm, prepTime, cookTime, servings]);

    const handleCreateRecipe = (newRecipe: NewRecipe) => {
        const token = localStorage.getItem('authToken');
        const recipeToCreate: Recipe = {
            ...newRecipe,
            id: 0,
            userFirstName: 'CurrentUserFirstName',
            userId: 0,
            ingredients: newRecipe.ingredients.map(ingredient => ({
                ...ingredient,
                id: ingredient.id || 0,
            })),
            tags: newRecipe.tags.map(tag => ({ ...tag, recipeId: 0 })),
        };

        fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(recipeToCreate),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create recipe');
                }
                return response.json();
            })
            .then((data) => {
                setRecipes([...recipes, data.data]);
            })
            .catch((error) => {
                logError('Error creating recipe:', error);
            });
    };

    const handleDeleteRecipe = (recipeId: number) => {
        const token = localStorage.getItem('authToken');
        fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
            })
            .catch((error) => {
                logError('Error deleting recipe:', error);
            });
    };

    const openRecipeModal = (recipe: Recipe) => {
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
                    recipe.description.toLowerCase().includes(searchTerm.toLowerCase()))) ||
            (prepTime !== null && prepTime > 0 && recipe.prepTimeInMinutes === prepTime) ||
            (cookTime !== null && cookTime > 0 && recipe.cookTimeInMinutes === cookTime) ||
            (servings !== null && servings > 0 && recipe.servings === servings)
        );
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd', padding: '20px', width: '100%', maxWidth: '1000px', gap: '10px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label htmlFor="searchTerm">Recipe Name / Description</label>
                    <input
                        id="searchTerm"
                        type="text"
                        placeholder="Name or Desc."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', fontSize: '0.85rem', borderRadius: '5px', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label htmlFor="prepTime">Prep Time (minutes)</label>
                    <input
                        id="prepTime"
                        type="number"
                        min="0"
                        placeholder="Prep time"
                        value={prepTime === null ? '' : prepTime}
                        onChange={(e) => setPrepTime(e.target.value ? parseInt(e.target.value) : null)}
                        style={{ padding: '10px', fontSize: '0.85rem', borderRadius: '5px', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label htmlFor="cookTime">Cook Time (minutes)</label>
                    <input
                        id="cookTime"
                        type="number"
                        min="0"
                        placeholder="Cook time"
                        value={cookTime === null ? '' : cookTime}
                        onChange={(e) => setCookTime(e.target.value ? parseInt(e.target.value) : null)}
                        style={{ padding: '10px', fontSize: '0.85rem', borderRadius: '5px', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label htmlFor="servings">Servings (quantity)</label>
                    <input
                        id="servings"
                        type="number"
                        min="0"
                        placeholder="Servings"
                        value={servings === null ? '' : servings}
                        onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : null)}
                        style={{ padding: '10px', fontSize: '0.85rem', borderRadius: '5px', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
                    />
                </div>
            </div>

            <Button style={{ backgroundColor: '#007BFF', margin: '10px', color: 'white', padding: '10px 20px', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
                Create Recipe
            </Button>

            <RecipeCreateModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleCreateRecipe={handleCreateRecipe}
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
