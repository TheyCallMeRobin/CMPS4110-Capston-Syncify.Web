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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './recipe.css';

interface EditIngredientProps {
  ingredients?: RecipeIngredientGetDto[];
  onAdd: (newIngredient: Omit<RecipeIngredientGetDto, 'id'>) => Promise<{
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
}) => {
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: 0,
    unit: '',
  });

  const [currentEditIngredient, setCurrentEditIngredient] =
    useState<RecipeIngredientGetDto | null>(null);

  const [addIngredientState, handleAddIngredient] = useAsyncFn(async () => {
    const ingredientToCreate = { ...newIngredient, recipeId };

    const response = await onAdd(ingredientToCreate);

    if (response?.data) {
      setNewIngredient({ name: '', quantity: 0, unit: '' });
      toast.success('Ingredient added successfully!');
    } else if (response?.errors) {
      const fieldErrors = response.errors.reduce(
        (acc: { [key: string]: string }, error: any) => {
          acc[error.propertyName.toLowerCase()] = error.errorMessage;
          return acc;
        },
        {}
      );
      setIngredientErrors(fieldErrors);
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
      toast.success('Ingredient updated successfully!');
    } else if (response?.errors) {
      const fieldErrors = response.errors.reduce(
        (acc: { [key: string]: string }, error: any) => {
          acc[error.propertyName.toLowerCase()] = error.errorMessage;
          return acc;
        },
        {}
      );
      setIngredientErrors(fieldErrors);
    }
  };

  const handleDeleteIngredient = async (ingredientId: number) => {
    const response = await onDelete(ingredientId);

    if (response?.data) {
      toast.success('Ingredient deleted successfully!');
    } else if (response?.errors) {
      const fieldErrors = response.errors.reduce(
        (acc: { [key: string]: string }, error: any) => {
          acc[error.propertyName.toLowerCase()] = error.errorMessage;
          return acc;
        },
        {}
      );
      setIngredientErrors(fieldErrors);
    }
  };

  const handleEditIngredient = (ingredient: RecipeIngredientGetDto) => {
    setCurrentEditIngredient(ingredient);
  };

  const handleIngredientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentEditIngredient((prev) =>
      prev
        ? { ...prev, [name]: name === 'quantity' ? Number(value) : value }
        : null
    );
  };
  const [ingredientErrors, setIngredientErrors] = useState<{
    [key: string]: string;
  }>({});

  const [units] = useState<string[]>([
    'Count',
    'Teaspoon',
    'Tablespoon',
    'Cup',
    'Pint',
    'Quart',
    'Gallon',
    'Milliliter',
    'Liter',
    'Ounce',
    'Pound',
    'Gram',
    'Kilogram',
    'Milligram',
    'Pinch',
    'Dash',
    'FluidOunce',
    'Piece',
  ]);

  return (
    <div>
      <h4>Ingredients</h4>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {currentEditIngredient?.id === ingredient.id ? (
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <input
                  type="text"
                  className="form-control mb-2"
                  name="name"
                  value={currentEditIngredient.name}
                  onChange={handleIngredientChange}
                />
                {ingredientErrors?.name && (
                  <p className="error-text">
                    <FaExclamationCircle
                      style={{
                        color: 'red',
                        fontSize: '1em',
                        marginRight: '5px',
                      }}
                    />
                    {ingredientErrors.name}
                  </p>
                )}
                <input
                  type="number"
                  className="form-control mb-2"
                  name="quantity"
                  value={currentEditIngredient.quantity}
                  onChange={handleIngredientChange}
                />
                {ingredientErrors?.quantity && (
                  <p className="error-text">
                    <FaExclamationCircle
                      style={{
                        color: 'red',
                        fontSize: '1em',
                        marginRight: '5px',
                      }}
                    />
                    {ingredientErrors.quantity}
                  </p>
                )}
                <select
                  name="unit"
                  value={currentEditIngredient.unit || ''}
                  onChange={handleIngredientChange}
                  className="form-control mb-2"
                >
                  <option value="">Select unit</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {ingredientErrors?.unit && (
                  <p className="error-text">
                    <FaExclamationCircle
                      style={{
                        color: 'red',
                        fontSize: '1em',
                        marginRight: '5px',
                      }}
                    />
                    {ingredientErrors.unit}
                  </p>
                )}
                <div className="icon-group" style={{ paddingBottom: '30px' }}>
                  <button
                    onClick={handleUpdateIngredient}
                    className="icon-button"
                    style={{ color: 'green' }}
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => setCurrentEditIngredient(null)}
                    className="icon-button"
                    style={{ color: '#d9534f' }}
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
                  {ingredient.name} {ingredient.quantity} {ingredient.unit}
                </span>
                <div className="icon-group" style={{ paddingBottom: '20px' }}>
                  <button
                    onClick={() => handleEditIngredient(ingredient)}
                    className="icon-button"
                  >
                    <FaEdit className="icon edit-icon" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteIngredient(ingredient.id)}
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
          value={newIngredient.unit}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, unit: e.target.value })
          }
          className="form-control item-edit-select"
        >
          <option value="">Select unit</option>
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
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