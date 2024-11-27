import React, { useEffect, useState } from 'react';
import './recipe.css';
import { RecipeIngredientService } from '../../api/generated/RecipeIngredientService';
import { ShoppingListItemService } from '../../api/generated/ShoppingListItemService';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService';
import {
    RecipeGetDto,
    RecipeIngredientGetDto,
    ShoppingListGetDto,
} from '../../api/generated/index.defs';
import { useAsyncFn } from 'react-use';

interface ViewRecipesProps {
    recipe: RecipeGetDto;
    onClose: () => void;
}

const ViewRecipes: React.FC<ViewRecipesProps> = ({ recipe, onClose }) => {
    const [ingredients, setIngredients] = useState<RecipeIngredientGetDto[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
    const [shoppingLists, setShoppingLists] = useState<ShoppingListGetDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [state, fetchIngredients] = useAsyncFn(async () => {
        const response = await RecipeIngredientService.getAll({
            recipeId: recipe.id,
        });
        return Array.isArray(response) ? response : response?.data || [];
    }, [recipe.id]);

    const [fetchShoppingListsState, fetchShoppingLists] = useAsyncFn(async () => {
        const response = await ShoppingListsService.getShoppingLists();
        return Array.isArray(response) ? response : response?.data || [];
    }, []);

    useEffect(() => {
        fetchIngredients().then((data) => {
            if (data) setIngredients(data);
        });
    }, [fetchIngredients]);

    const handleIngredientSelect = (id: number) => {
        setSelectedIngredients((prev) =>
            prev.includes(id)
                ? prev.filter((ingredientId) => ingredientId !== id)
                : [...prev, id]
        );
    };

    const handleAddToShoppingListClick = () => {
        setIsModalOpen(true);
        fetchShoppingLists().then((data) => {
            if (data) setShoppingLists(data);
        });
    };

    const handleAddToSelectedList = async (listId: number) => {
        await Promise.all(
            selectedIngredients.map(async (ingredientId) => {
                const ingredient = ingredients.find((ing) => ing.id === ingredientId);
                if (ingredient) {
                    await ShoppingListItemService.createShoppingListItem({
                        body: {
                            name: ingredient.name,
                            quantity: ingredient.quantity,
                            unit: ingredient.unit,
                            shoppingListId: listId,
                            isChecked: false, 
                        },
                    });
                }
            })
        );

        setIsModalOpen(false);
        setSelectedIngredients([]);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{recipe.name || 'Untitled Recipe'}</h3>

                <p>{recipe.description || 'No description provided.'}</p>

                <h4>Ingredients</h4>
                {state.loading ? (
                    <p>Loading ingredients...</p>
                ) : state.error ? (
                    <p>Error loading ingredients. Please try again later.</p>
                ) : (
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={handleAddToShoppingListClick}
                            disabled={selectedIngredients.length === 0}
                        >
                            Add to Shopping List
                        </button>
                        <ul>
                            {ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedIngredients.includes(ingredient.id)}
                                            onChange={() => handleIngredientSelect(ingredient.id)}
                                        />
                                        {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button onClick={onClose} className="btn btn-secondary">
                    Close
                </button>

                {isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Select a Shopping List</h3>
                            {fetchShoppingListsState.loading ? (
                                <p>Loading shopping lists...</p>
                            ) : fetchShoppingListsState.error ? (
                                <p>Error loading shopping lists. Please try again later.</p>
                            ) : (
                                <ul>
                                    {shoppingLists.map((list) => (
                                        <li key={list.id}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleAddToSelectedList(list.id)}
                                            >
                                                {list.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRecipes;
