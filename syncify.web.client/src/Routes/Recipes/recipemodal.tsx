import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// Define the Recipe type based on your backend DTO
interface Recipe {
    id: number;
    name: string;
    description: string;
    prepTimeInMinutes: number;
    cookTimeInMinutes: number;
    servings: number;
    userFirstName: string;
}

interface RecipeModalProps {
    show: boolean; // Determines if the modal should be shown
    onHide: () => void; // Function to hide the modal
    recipe: Recipe | null; // The selected recipe or null if none is selected
}

const RecipeModal: React.FC<RecipeModalProps> = ({ show, onHide, recipe }) => {
    if (!recipe) return null; // If no recipe is selected, return nothing

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{recipe.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Description:</strong> {recipe.description}</p>
                <p><strong>Prep Time:</strong> {recipe.prepTimeInMinutes} minutes</p>
                <p><strong>Cook Time:</strong> {recipe.cookTimeInMinutes} minutes</p>
                <p><strong>Servings:</strong> {recipe.servings}</p>
                <p><strong>Author:</strong> {recipe.userFirstName}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecipeModal;
