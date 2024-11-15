import React, { useState } from 'react';
import { RecipeIngredientGetDto } from '../../api/generated/index.defs';
import {
  FaTrashAlt,
  FaExclamationCircle,
  FaEdit,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { useAsyncFn } from 'react-use';
import './recipe.css';

const availableUnits = [
    'Tsp',
    'Tbsp',
    'Cup',
    'Pint',
    'Quart',
    'Gallon',
    'Ml',
    'L',
    'Oz',
    'Lb',
    'G',
    'Kg',
    'Mg',
    'Pinch',
    'Dash',
    'Fl oz',
    'Piece',
];

interface EditIngredientProps {
  ingredients?: RecipeIngredientGetDto[];
  onAdd: (
    newIngredient: Omit<RecipeIngredientGetDto, 'id'>
  ) => Promise<{
    data?: any;
    errors?: { errorMessage?: string; propertyName?: string }[];
  }>;
  onUpdate: (
    ingredientId: number,
    updatedData: RecipeIngredientGetDto
  ) => Promise<{ data?: any; errors?: { errorMessage?: string }[] }>;
  onDelete: (
    ingredientId: number
  ) => Promise<{ data?: any; errors?: { errorMessage?: string }[] }>;
  recipeId: number;
  ingredientErrors?: { [key: string]: string };
}

const EditIngredient: React.FC<EditIngredientProps> = ({
  ingredients = [],
  onAdd,
  onUpdate,
  onDelete,
  recipeId,
  ingredientErrors,
}) => {
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    description: '',
    quantity: 0,
    unit: '',
  });

  const [currentEditIngredient, setCurrentEditIngredient] =
    useState<RecipeIngredientGetDto | null>(null);

  const [addIngredientState, handleAddIngredient] = useAsyncFn(async () => {
    const ingredientToCreate = {
      ...newIngredient,
      recipeId,
      unit: formatUnit(newIngredient.unit),
    };

    const response = await onAdd(ingredientToCreate);

    if (response?.data) {
      setNewIngredient({ name: '', description: '', quantity: 0, unit: '' });
    }
  }, [newIngredient, recipeId, onAdd]);

  const handleUpdateIngredient = async () => {
    if (!currentEditIngredient) return;

    const response = await onUpdate(
      currentEditIngredient.id,
      currentEditIngredient
    );
    if (response?.data) {
      setCurrentEditIngredient(null);
    }
  };

  const handleEditIngredient = (ingredient: RecipeIngredientGetDto) => {
    setCurrentEditIngredient(ingredient);
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEditIngredient((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const formatUnit = (unit: string) => {
    return unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase();
  };

  return (
    <div>
      <h4>Ingredients</h4>
      <ul>
        {(ingredients || []).map((ingredient) => (
          <li key={ingredient.id}>
            {currentEditIngredient?.id === ingredient.id ? (
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <input
                  type="text"
                  name="name"
                  value={currentEditIngredient.name}
                  onChange={handleIngredientChange}
                />
                <input
                  type="number"
                  name="quantity"
                  value={currentEditIngredient.quantity}
                  onChange={handleIngredientChange}
                />
                <input
                  type="text"
                  name="unit"
                  value={currentEditIngredient.unit}
                  onChange={handleIngredientChange}
                />
                <div className="icon-group">
                  <button
                    onClick={handleUpdateIngredient}
                    className="icon-button"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => setCurrentEditIngredient(null)}
                    className="icon-button"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="ingredient-item"
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <span>
                  {ingredient.name} - {ingredient.description} -{' '}
                  {ingredient.quantity} {ingredient.unit}
                </span>
                <div className="icon-group">
                  <button
                    onClick={() => handleEditIngredient(ingredient)}
                    className="icon-button"
                  >
                    <FaEdit className="icon edit-icon" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(ingredient.id)}
                    className="icon-button"
                  >
                    <FaTrashAlt className="icon delete-icon" /> Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="ingredient-input-container">
        <input
          type="text"
          placeholder="Ingredient Name"
          value={newIngredient.name}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, name: e.target.value })
          }
          className="ingredient-input"
        />
        {ingredientErrors?.name && (
          <p className="error-text">
            <FaExclamationCircle
              style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
            />
            {ingredientErrors.name}
          </p>
        )}

        <input
          type="text"
          placeholder="Description"
          value={newIngredient.description}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, description: e.target.value })
          }
          className="ingredient-input"
        />
        {ingredientErrors?.description && (
          <p className="error-text">
            <FaExclamationCircle
              style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
            />
            {ingredientErrors.description}
          </p>
        )}

        <input
          type="number"
          placeholder="Quantity"
          value={newIngredient.quantity}
          onChange={(e) =>
            setNewIngredient({
              ...newIngredient,
              quantity: Number(e.target.value),
            })
          }
          className="ingredient-input"
          min="0"
        />
        {ingredientErrors?.quantity && (
          <p className="error-text">
            <FaExclamationCircle
              style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
            />
            {ingredientErrors.quantity}
          </p>
        )}

                <select
                    className="form-control mb-2"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                >
                    <option value="">Select unit</option>
                    {availableUnits.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                    ))}
                </select>
              {ingredientErrors?.unit && (
                  <p className="error-text">
                      <FaExclamationCircle
                          style={{ color: 'red', fontSize: '1em', marginRight: '5px' }}
                      />
                      {ingredientErrors.unit}
                  </p>
              )}

                <button
                    onClick={handleAddIngredient}
                    className="add-ingredient-button"
                    disabled={addIngredientState.loading}
                >
                    {addIngredientState.loading ? 'Adding...' : 'Add Ingredient'}
                </button>
            </div>
        </div>
    );
};

export default EditIngredient;
