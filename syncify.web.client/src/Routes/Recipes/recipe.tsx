import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './recipe.css';

export const Recipes: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]); // Holds all recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(''); // Holds the search query

    // Fetch recipes from the backend using Axios
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('https://localhost:7061/api/recipes');
                console.log('Axios response:', response);

                // Access the recipes from `response.data.data`
                if (response && response.data && response.data.data) {
                    setRecipes(response.data.data); // Update this line to use the correct path
                } else {
                    console.error('No data found');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // Filter the recipes based on the search query
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div>Loading recipes...</div>;
    }

    return (
        <div className="container">
            {/* Search Field */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search recipes by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Recipe List */}
            <div className="content">
                {filteredRecipes && filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => (
                        <div key={recipe.id} className="section">
                            <h3 className="recipe-title">{recipe.name}</h3>
                            <p>{recipe.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No recipes match your search.</p>
                )}
            </div>
        </div>
    );
};
