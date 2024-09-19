import React, { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch recipes from the backend
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/api/recipes');
                const data = await response.json();
                setRecipes(data.data); // Assuming the API response format is { data: Recipe[], hasErrors: boolean, errors: any[] }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="content">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="section">
                        <p className="recipe-title">{recipe.name}</p>
                        <p>{recipe.description}</p>
                        <p><strong>Prep Time:</strong> {recipe.prepTimeInMinutes} minutes</p>
                        <p><strong>Cook Time:</strong> {recipe.cookTimeInMinutes} minutes</p>
                        <p><strong>Servings:</strong> {recipe.servings}</p>
                        <p><strong>Author:</strong> {recipe.userFirstName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
