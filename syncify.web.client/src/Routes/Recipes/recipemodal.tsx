import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { RecipeGetDto } from '../../api/generated/index.defs.ts';

type RecipeModalProps = {
    show: boolean;
    onHide: () => void;
    recipe: RecipeGetDto | null;
    onDeleteRecipe: (recipeId: number) => void;
};

const RecipeModal: React.FC<RecipeModalProps> = ({
    show,
    onHide,
    recipe,
    onDeleteRecipe,
}) => {
    if (!recipe) return null;

    const handleDelete = () => {
        onDeleteRecipe(recipe.id);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{recipe.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    <strong>Description:</strong> {recipe.description}
                </p>
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
                    <strong>Author:</strong> {recipe.userFirstName}
                </p>

                <div>
                    <h5>Ingredients</h5>
                    <ul>
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                    {ingredient.description && ` (${ingredient.description})`}
                                </li>
                            ))
                        ) : (
                            <li>No ingredients found for this recipe.</li>
                        )}
                    </ul>
                </div>

                <div>
                    <h5>Tags</h5>
                    <ul>
                        {recipe.tags && recipe.tags.length > 0 ? (
                            recipe.tags.map((tag) => <li key={tag.id}>{tag.name}</li>)
                        ) : (
                            <li>No tags found for this recipe.</li>
                        )}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={handleDelete}
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecipeModal;