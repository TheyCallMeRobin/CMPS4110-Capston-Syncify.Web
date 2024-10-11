import React, { useState, useEffect } from 'react';
import { Modal, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import { NewRecipe, RecipeIngredient } from './Recipe';  

interface RecipeCreateModalProps {
    show: boolean;
    handleClose: () => void;
    handleCreateRecipe: (newRecipe: NewRecipe) => void;
}

const RecipeCreateModal: React.FC<RecipeCreateModalProps> = ({ show, handleClose, handleCreateRecipe }) => {
    const [newRecipe, setNewRecipe] = useState<NewRecipe>({
        name: '',
        description: '',
        prepTimeInMinutes: 0,
        cookTimeInMinutes: 0,
        servings: 0,
        ingredients: [{ id: 0, name: '', unit: '', quantity: 0 }],
        tags: [{ id: 0, name: '' }]
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        prepTimeInMinutes: '',
        cookTimeInMinutes: '',
        servings: '',
        ingredients: '',
        tags: ''
    });

    useEffect(() => {
        if (show) {
            setErrors({
                name: '',
                description: '',
                prepTimeInMinutes: '',
                cookTimeInMinutes: '',
                servings: '',
                ingredients: '',
                tags: ''
            });
        }
    }, [show]);

    const validateFields = (): boolean => {
        let isValid = true;
        const newErrors = {
            name: '',
            description: '',
            prepTimeInMinutes: '',
            cookTimeInMinutes: '',
            servings: '',
            ingredients: '',
            tags: ''
        };

        if (!newRecipe.name) {
            newErrors.name = 'Recipe Name cannot be empty.';
            isValid = false;
        }
        if (!newRecipe.description) {
            newErrors.description = 'Description cannot be empty.';
            isValid = false;
        }
        if (!newRecipe.prepTimeInMinutes) {
            newErrors.prepTimeInMinutes = 'Prep Time cannot be empty.';
            isValid = false;
        }
        if (!newRecipe.cookTimeInMinutes) {
            newErrors.cookTimeInMinutes = 'Cook Time cannot be empty.';
            isValid = false;
        }
        if (!newRecipe.servings) {
            newErrors.servings = 'Servings cannot be empty.';
            isValid = false;
        }

        newRecipe.ingredients.forEach((ingredient, index) => {
            if (!ingredient.name || !ingredient.unit || !ingredient.quantity) {
                newErrors.ingredients = 'Ingredient Name, Unit, or Quantity cannot be empty.';
                isValid = false;
            }
        });

        newRecipe.tags.forEach((tag) => {
            if (!tag.name) {
                newErrors.tags = 'Tags cannot be empty.';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSaveRecipe = () => {
        if (validateFields()) {
            handleCreateRecipe(newRecipe);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setNewRecipe(prev => ({
            ...prev,
            [field]: value
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: ''
        }));
    };

    const handleIngredientChange = (index: number, field: string, value: any) => {
        const updatedIngredients = [...newRecipe.ingredients];
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: value
        };
        setNewRecipe(prev => ({
            ...prev,
            ingredients: updatedIngredients
        }));

        if (field === 'name' || field === 'unit' || field === 'quantity') {
            setErrors(prevErrors => ({
                ...prevErrors,
                ingredients: ''
            }));
        }
    };

    const handleTagChange = (index: number, value: any) => {
        const updatedTags = [...newRecipe.tags];
        updatedTags[index].name = value;
        setNewRecipe(prev => ({
            ...prev,
            tags: updatedTags
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            tags: ''
        }));
    };

    const handleAddIngredient = () => {
        setNewRecipe(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { id: 0, name: '', unit: '', quantity: 0 }]
        }));
    };

    const handleRemoveIngredient = (index: number) => {
        setNewRecipe(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const handleAddTag = () => {
        setNewRecipe(prev => ({
            ...prev,
            tags: [...prev.tags, { id: 0, name: '' }]
        }));
    };

    const handleRemoveTag = (index: number) => {
        setNewRecipe(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const renderUnitTooltip = (props: any) => (
        <Tooltip id="unit-tooltip" {...props}>
            Available units: tsp, tbsp, cup, pint, quart, gallon, ml, l, oz, lb, g, kg, mg, pinch, dash, fl oz, piece
        </Tooltip>
    );

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="recipeName">Recipe Name</label>
                    <input
                        id="recipeName"
                        type="text"
                        placeholder="e.g., Chocolate Cake"
                        value={newRecipe.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                    />
                    {errors.name && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.name}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="e.g., A delicious and moist chocolate cake"
                        value={newRecipe.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                    />
                    {errors.description && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.description}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="prepTime">Prep Time (minutes)</label>
                    <input
                        id="prepTime"
                        type="number"
                        placeholder="e.g., 15"
                        value={newRecipe.prepTimeInMinutes}
                        onChange={(e) => handleInputChange('prepTimeInMinutes', parseInt(e.target.value))}
                        style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                        min="0"
                    />
                    {errors.prepTimeInMinutes && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.prepTimeInMinutes}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="cookTime">Cook Time (minutes)</label>
                    <input
                        id="cookTime"
                        type="number"
                        placeholder="e.g., 30"
                        value={newRecipe.cookTimeInMinutes}
                        onChange={(e) => handleInputChange('cookTimeInMinutes', parseInt(e.target.value))}
                        style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                        min="0"
                    />
                    {errors.cookTimeInMinutes && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.cookTimeInMinutes}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="servings">Servings</label>
                    <input
                        id="servings"
                        type="number"
                        placeholder="e.g., 4"
                        value={newRecipe.servings}
                        onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                        style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                        min="1"
                    />
                    {errors.servings && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.servings}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Ingredients</label>
                    {newRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <input
                                type="text"
                                placeholder="Ingredient name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                            />
                            <OverlayTrigger placement="right" overlay={renderUnitTooltip}>
                                <input
                                    type="text"
                                    placeholder="Unit"
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                    style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                                />
                            </OverlayTrigger>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                min="1"
                                onChange={(e) => handleIngredientChange(index, 'quantity', parseInt(e.target.value))}
                                style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                            />
                            <FaTrashAlt
                                onClick={() => handleRemoveIngredient(index)}
                                style={{ cursor: 'pointer', color: 'red', marginRight: '10px', marginTop: '10px' }}
                            />
                        </div>
                    ))}
                    {errors.ingredients && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.ingredients}</div>}
                    <Button onClick={handleAddIngredient} style={{ backgroundColor: '#007BFF', color: 'white', marginTop: '10px' }}>
                        Add Ingredient
                    </Button>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Tags</label>
                    {newRecipe.tags.map((tag, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <input
                                type="text"
                                placeholder="Tag name"
                                value={tag.name}
                                onChange={(e) => handleTagChange(index, e.target.value)}
                                style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                            />
                            <FaTrashAlt
                                onClick={() => handleRemoveTag(index)}
                                style={{ cursor: 'pointer', color: 'red', marginRight: '10px', marginTop: '10px' }}
                            />
                        </div>
                    ))}
                    {errors.tags && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.tags}</div>}
                    <Button onClick={handleAddTag} style={{ backgroundColor: '#007BFF', color: 'white', marginTop: '10px' }}>
                        Add Tag
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSaveRecipe} style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>
                    Save Recipe
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecipeCreateModal;
