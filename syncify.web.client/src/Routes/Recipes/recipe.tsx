import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecipeList from './RecipeList'; // Import the new RecipeList component
import RecipeModal from './RecipeModal'; // Import the new RecipeModal component
import './recipe.css';

// Define the Recipe type based on the backend DTO
interface Recipe {
    id: number;
    name: string;
    description: string;
    prepTimeInMinutes: number;
    cookTimeInMinutes: number;
    servings: number;
    userFirstName: string;
}

export const Recipes: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // State for selected recipe
    const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false); // State for controlling modal visibility
    const [newRecipe, setNewRecipe] = useState({
        name: '',
        description: '',
        prepTimeInMinutes: 0,
        cookTimeInMinutes: 0,
        servings: 0,
    });
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input
    const [prepTime, setPrepTime] = useState<number | ''>(''); // State for prep time filter
    const [cookTime, setCookTime] = useState<number | ''>(''); // State for cook time filter
    const [servings, setServings] = useState<number | ''>(''); // State for servings filter
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false); // Bootstrap modal state

    useEffect(() => {
        const fetchRecipes = () => {
            const token = localStorage.getItem('authToken');
            fetch('/api/recipes', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => setRecipes(data.data))
                .finally(() => setLoading(false));
        };

        fetchRecipes();
    }, []);

    const handleCreateRecipe = () => {
        const token = localStorage.getItem('authToken');

        fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newRecipe),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create recipe');
                }
                return response.json();
            })
            .then((data) => {
                setRecipes([...recipes, data.data]);
                setNewRecipe({
                    name: '',
                    description: '',
                    prepTimeInMinutes: 0,
                    cookTimeInMinutes: 0,
                    servings: 0,
                });
                setShowModal(false); // Close modal after creation
            })
            .catch((error) => {
                console.error('Error creating recipe:', error);
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
                console.error('Error deleting recipe:', error);
            });
    };

    const openRecipeModal = (recipe: Recipe) => {
        setSelectedRecipe(recipe); // Set the selected recipe
        setShowRecipeModal(true); // Show the modal
    };

    const closeRecipeModal = () => {
        setShowRecipeModal(false); // Close the modal
        setSelectedRecipe(null); // Reset the selected recipe
    };

    // Filter recipes based on the search term, prep time, cook time, and servings
    const filteredRecipes = recipes.filter((recipe) => {
        return (
            (recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (prepTime ? recipe.prepTimeInMinutes <= prepTime : true) &&
            (cookTime ? recipe.cookTimeInMinutes <= cookTime : true) &&
            (servings ? recipe.servings === servings : true)
        );
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            {/* Create Recipe and Search Section */}
            <div className="header">
                <div className="search-fields">
                    <label htmlFor="searchTerm">Recipe Name / Description</label>
                    <input
                        id="searchTerm"
                        type="text"
                        placeholder="Name or Desc."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar"
                    />
                </div>
                <div className="search-fields">
                    <label htmlFor="prepTime">Prep Time (minutes)</label>
                    <input
                        id="prepTime"
                        type="number"
                        min="0"
                        placeholder="Prep time"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value ? parseInt(e.target.value) : '')}
                        className="search-bar"
                    />
                </div>
                <div className="search-fields">
                    <label htmlFor="cookTime">Cook Time (minutes)</label>
                    <input
                        id="cookTime"
                        type="number"
                        min="0"
                        placeholder="Cook time"
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value ? parseInt(e.target.value) : '')}
                        className="search-bar"
                    />
                </div>
                <div className="search-fields">
                    <label htmlFor="servings">Servings (quantity)</label>
                    <input
                        id="servings"
                        type="number"
                        min="0"
                        placeholder="Servings"
                        value={servings}
                        onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : '')}
                        className="search-bar"
                    />
                </div>
            </div>

            <button className="create-button" onClick={() => setShowModal(true)}>
                Create Recipe
            </button>

            {/* Import and use RecipeList to render the recipe content */}
            <RecipeList
                recipes={filteredRecipes}
                onRecipeClick={openRecipeModal}
                onDeleteRecipe={handleDeleteRecipe}
            />

            {/* Modal for showing selected recipe details */}
            <RecipeModal
                show={showRecipeModal}
                onHide={closeRecipeModal}
                recipe={selectedRecipe}
            />
        </div>
    );
};
