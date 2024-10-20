import React, { useState, useEffect } from 'react';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import {
    RecipeCreateDto,
    RecipeIngredientCreateDto,
    RecipeTagCreateDto,
} from '../../api/generated/index.defs.ts';

// Define RecipeCreateModalProps as a type
type RecipeCreateModalProps = {
    show: boolean;
    handleClose: () => void;
    handleCreateRecipe: (
        newRecipe: RecipeCreateDto,
        ingredients: RecipeIngredientCreateDto[],
        tags: RecipeTagCreateDto[]
    ) => void;
    userId: number;
};

// Predefined list of valid units
const validUnits = [
    'tsp', 'tbsp', 'cup', 'pint', 'quart', 'gallon', 'ml', 'l', 'oz', 'lb',
    'g', 'kg', 'mg', 'pinch', 'dash', 'fl oz', 'piece'
];

// UnitTooltip component to always display
const UnitTooltip = () => (
    <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '5px' }}>
        <strong>Available units:</strong> {validUnits.join(', ')}
    </div>
);

const RecipeCreateModal: React.FC<RecipeCreateModalProps> = ({
    show,
    handleClose,
    handleCreateRecipe,
    userId,
}) => {
    const [recipeName, setRecipeName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [prepTime, setPrepTime] = useState<number>(0);
    const [cookTime, setCookTime] = useState<number>(0);
    const [servings, setServings] = useState<number>(0);
    const [ingredients, setIngredients] = useState<RecipeIngredientCreateDto[]>([
        { name: '', quantity: 0, unit: '', description: '', recipeId: 0 },
    ]);
    const [tags, setTags] = useState<RecipeTagCreateDto[]>([
        { name: '', recipeId: 0 },
    ]);
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        ingredients: '',
        tags: '',
        unit: ''
    });

    useEffect(() => {
        if (show) {
            setErrors({
                name: '',
                description: '',
                prepTime: '',
                cookTime: '',
                servings: '',
                ingredients: '',
                tags: '',
                unit: ''
            });
        }
    }, [show]);

    const validateFields = (): boolean => {
        let isValid = true;
        const newErrors = {
            name: '',
            description: '',
            prepTime: '',
            cookTime: '',
            servings: '',
            ingredients: '',
            tags: '',
            unit: ''
        };

        if (!recipeName) {
            newErrors.name = 'Recipe Name cannot be empty.';
            isValid = false;
        }
        if (!description) {
            newErrors.description = 'Description cannot be empty.';
            isValid = false;
        }
        if (!prepTime || prepTime < 1) {
            newErrors.prepTime = 'Prep Time must be greater than 0.';
            isValid = false;
        }
        if (!cookTime || cookTime < 1) {
            newErrors.cookTime = 'Cook Time must be greater than 0.';
            isValid = false;
        }
        if (!servings || servings < 1) {
            newErrors.servings = 'Servings must be greater than 0.';
            isValid = false;
        }

        ingredients.forEach((ingredient) => {
            if (!ingredient.name || !ingredient.unit || !ingredient.quantity || ingredient.quantity <= 0) {
                newErrors.ingredients = 'All ingredient fields must be filled out and quantity must be greater than 0.';
                isValid = false;
            }
            // Validate unit
            if (!validUnits.includes(ingredient.unit)) {
                newErrors.unit = `You must enter a valid unit for ingredient "${ingredient.name}" (valid units: ${validUnits.join(', ')})`;
                isValid = false;
            }
        });

        tags.forEach((tag) => {
            if (!tag.name) {
                newErrors.tags = 'All tag fields must be filled out.';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateFields()) {
            const recipeCreateDto: RecipeCreateDto = {
                name: recipeName,
                description: description,
                prepTimeInMinutes: prepTime,
                cookTimeInMinutes: cookTime,
                servings: servings,
                userId: userId,
                ingredients: [],
                tags: [],
            };

            const updatedIngredients = ingredients.map((ingredient) => ({
                ...ingredient,
                recipeId: 0, // This will be updated after the recipe is created
            }));

            const updatedTags = tags.map((tag) => ({
                ...tag,
                recipeId: 0, // This will be updated after the recipe is created
            }));

            handleCreateRecipe(recipeCreateDto, updatedIngredients, updatedTags);
            handleClose();
        }
    };

    const handleIngredientChange = (index: number, field: string, value: any) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: value,
        };
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            { name: '', quantity: 0, unit: '', description: '', recipeId: 0 },
        ]);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleTagChange = (index: number, value: string) => {
        const updatedTags = [...tags];
        updatedTags[index].name = value;
        setTags(updatedTags);
    };

    const addTag = () => {
        setTags([...tags, { name: '', recipeId: 0 }]);
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="recipeName">Recipe Name</label>
                        <input
                            id="recipeName"
                            type="text"
                            placeholder="e.g., Chocolate Cake"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            style={{
                                padding: '10px',
                                fontSize: '0.85rem',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                width: '100%',
                            }}
                        />
                        {errors.name && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="e.g., A delicious and moist chocolate cake"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                padding: '10px',
                                fontSize: '0.85rem',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                width: '100%',
                            }}
                        />
                        {errors.description && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.description}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="prepTime">Prep Time (minutes)</label>
                        <input
                            id="prepTime"
                            type="number"
                            placeholder="e.g., 15"
                            value={prepTime}
                            onChange={(e) => setPrepTime(Number(e.target.value))}
                            style={{
                                padding: '10px',
                                fontSize: '0.85rem',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                width: '100%',
                            }}
                            min="1"
                        />
                        {errors.prepTime && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.prepTime}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="cookTime">Cook Time (minutes)</label>
                        <input
                            id="cookTime"
                            type="number"
                            placeholder="e.g., 30"
                            value={cookTime}
                            onChange={(e) => setCookTime(Number(e.target.value))}
                            style={{
                                padding: '10px',
                                fontSize: '0.85rem',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                width: '100%',
                            }}
                            min="1"
                        />
                        {errors.cookTime && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.cookTime}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="servings">Servings</label>
                        <input
                            id="servings"
                            type="number"
                            placeholder="e.g., 4"
                            value={servings}
                            onChange={(e) => setServings(Number(e.target.value))}
                            style={{
                                padding: '10px',
                                fontSize: '0.85rem',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                width: '100%',
                            }}
                            min="1"
                        />
                        {errors.servings && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.servings}
                            </div>
                        )}
                    </div>

                    {/* Ingredients Section */}
                    <div style={{ marginBottom: '15px' }}>
                        <h5>Ingredients</h5>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Ingredient name"
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    style={{
                                        padding: '10px',
                                        fontSize: '0.85rem',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        width: '100%',
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                                    style={{
                                        padding: '10px',
                                        fontSize: '0.85rem',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        width: '100%',
                                    }}
                                    min="1"
                                />



                                <input
                                    type="text"
                                    placeholder="Unit (e.g., cups, grams)"
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                    style={{
                                        padding: '10px',
                                        fontSize: '0.85rem',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        width: '100%',
                                    }}
                                />
                                <UnitTooltip />


                                <FaTrashAlt
                                    onClick={() => removeIngredient(index)}
                                    style={{ cursor: 'pointer', color: 'red', marginTop: '10px' }}
                                />
                            </div>
                        ))}
                        {errors.ingredients && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.ingredients}
                            </div>
                        )}
                        {errors.unit && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.unit}
                            </div>
                        )}
                        <Button
                            onClick={addIngredient}
                            style={{
                                backgroundColor: '#007BFF',
                                color: 'white',
                                marginTop: '10px',
                            }}
                        >
                            Add Ingredient
                        </Button>
                    </div>

                    {/* Tags Section */}
                    <div style={{ marginBottom: '15px' }}>
                        <h5>Tags</h5>
                        {tags.map((tag, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Tag name"
                                    value={tag.name}
                                    onChange={(e) => handleTagChange(index, e.target.value)}
                                    style={{
                                        padding: '10px',
                                        fontSize: '0.85rem',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        width: '100%',
                                    }}
                                />
                                <FaTrashAlt
                                    onClick={() => removeTag(index)}
                                    style={{ cursor: 'pointer', color: 'red', marginTop: '10px' }}
                                />
                            </div>
                        ))}
                        {errors.tags && (
                            <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                {errors.tags}
                            </div>
                        )}
                        <Button
                            onClick={addTag}
                            style={{
                                backgroundColor: '#007BFF',
                                color: 'white',
                                marginTop: '10px',
                            }}
                        >
                            Add Tag
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        style={{
                            backgroundColor: '#007BFF',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        Create Recipe
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default RecipeCreateModal;