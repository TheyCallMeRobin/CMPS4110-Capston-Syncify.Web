import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
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
    const [newRecipe, setNewRecipe] = useState({
        name: '',
        description: '',
        prepTimeInMinutes: 0,
        cookTimeInMinutes: 0,
        servings: 0,
    });
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input
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

    // Filter recipes based on the search term
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            {/* Create Recipe and Search Section */}
            <div className="header">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <button className="create-button" onClick={() => setShowModal(true)}>
                    Create Recipe
                </button>
            </div>

            {/* Recipe Content */}
            <div className="content">
                {filteredRecipes.map((recipe) => (
                    <div key={recipe.id} className="section">
                        <p className="recipe-title">{recipe.name}</p>
                        <p>{recipe.description}</p>
                        <p>
                            <strong>Prep Time:</strong> {recipe.prepTimeInMinutes} minutes
                        </p>
                        <p>
                            <strong>Cook Time:</strong> {recipe.cookTimeInMinutes} minutes
                        </p>
                        <p>
                            <strong>Servings:</strong> {recipe.servings}
                        </p>
                        <p>
                            <strong>Author:</strong> {recipe.userFirstName ? recipe.userFirstName : 'Unknown'}
                        </p>
                        <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Bootstrap Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="recipeName">Recipe Name</label>
                        <input
                            id="recipeName"
                            type="text"
                            value={newRecipe.name}
                            onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                            className="form-control mb-3"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            id="description"
                            type="text"
                            value={newRecipe.description}
                            onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                            className="form-control mb-3"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prepTime">Preparation Time (minutes)</label>
                        <input
                            id="prepTime"
                            type="number"
                            value={newRecipe.prepTimeInMinutes}
                            onChange={(e) =>
                                setNewRecipe({ ...newRecipe, prepTimeInMinutes: parseInt(e.target.value) })
                            }
                            className="form-control mb-3"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cookTime">Cook Time (minutes)</label>
                        <input
                            id="cookTime"
                            type="number"
                            value={newRecipe.cookTimeInMinutes}
                            onChange={(e) =>
                                setNewRecipe({ ...newRecipe, cookTimeInMinutes: parseInt(e.target.value) })
                            }
                            className="form-control mb-3"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="servings">Servings (qty)</label>
                        <input
                            id="servings"
                            type="number"
                            value={newRecipe.servings}
                            onChange={(e) =>
                                setNewRecipe({ ...newRecipe, servings: parseInt(e.target.value) })
                            }
                            className="form-control mb-3"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateRecipe}>
                        Create Recipe
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
};
