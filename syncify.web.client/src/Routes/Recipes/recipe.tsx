import React, { useState, useEffect } from 'react';
import './recipe.css';
import './../../index.css';

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
        const fetchRecipes = () => {
            fetch('/api/recipes')
                .then(response => response.json())
                .then(data => setRecipes(data.data))
                .finally(() => setLoading(false));
        };

        fetchRecipes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            {recipes.map(recipe => (
                <div className="recipe-item" key={recipe.id}>
                    <h2 className="text-center text-highlight mb-4">{recipe.name}</h2>
                    <h4>{recipe.description}</h4>
                    <h6><strong>Prep Time:</strong> {recipe.prepTimeInMinutes} minutes</h6>
                    <h6><strong>Cook Time:</strong> {recipe.cookTimeInMinutes} minutes</h6>
                    <h6><strong>Servings:</strong> {recipe.servings}</h6>
                    <h6><strong>Author:</strong> {recipe.userFirstName}</h6>
                </div>
            ))}
        </div>

    );
};
