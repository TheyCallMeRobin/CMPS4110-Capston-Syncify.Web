import React, { useState } from 'react';
import './shoppinglists.css';
import { logError } from '../../utils/logger';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService.ts';
import { ShoppingListGetDto, ShoppingListUpdateDto } from '../../api/generated/index.defs.ts';
import { useUser } from '../../auth/auth-context.tsx';
import { useAsyncFn } from 'react-use';

const ShoppingLists = () => {
    const [items, setItems] = useState<ShoppingListGetDto[]>([]);
    const [newItem, setNewItem] = useState<string>('');
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string>('');
    const user = useUser();

    const [{ loading, error }, fetchShoppingLists] = useAsyncFn(async () => {
        if (!user?.id) return;

        const response = await ShoppingListsService.getShoppingListsByUserId({
            userId: Number(user?.id),
        });

        if (response.hasErrors) {
            logError('Failed to fetch shopping lists');
            setItems([]);
            return;
        }

        const validItems = Array.isArray(response.data)
            ? response.data.map((item) => ({
                ...item,
                checked: item.checked ?? false,
                completed: item.completed ?? false,
            }))
            : [];

        setItems(validItems);
    }, [user?.id]);

    React.useEffect(() => {
        if (user?.id) {
            fetchShoppingLists(); 
        }
    }, [user?.id, fetchShoppingLists]);

    const [, handleAddItem] = useAsyncFn(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
            const newItemObj = {
                name: newItem,
                description: '',
                userId: Number(user?.id),
            };

            const response = await ShoppingListsService.createShoppingList({
                body: newItemObj,
            });

            if (response.hasErrors) {
                logError('Failed to create shopping list item');
                return;
            }

            if (response.data) {
                setItems([
                    ...items,
                    { ...response.data, checked: false, completed: false },
                ]);
                setNewItem('');
            }
        }
    }, [newItem, items, user?.id]);

    const [, handleRemoveCheckedItems] = useAsyncFn(() => {
        const confirmed = window.confirm('Are you sure you want to remove all checked items?');
        if (!confirmed) {
            return Promise.resolve();
        }

        const checkedItems = items.filter((item) => item.checked);

        const deletePromises = checkedItems.map((item) =>
            ShoppingListsService.deleteShoppingList({
                id: item.id,
            })
        );

        return Promise.all(deletePromises)
            .then(() => {
                setItems(items.filter((item) => !item.checked));
            })
            .catch((error) => {
                logError('Error while deleting items:', error);
            });
    }, [items]);

    const handleSaveItem = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const updatedItemObj: ShoppingListUpdateDto = {
            name: editedName,
            description: item.description,
            checked: item.checked,
            completed: item.completed,
        };

        ShoppingListsService.updateShoppingList({
            id,
            body: updatedItemObj,
        })
            .then((response) => {
                if (response.hasErrors) {
                    logError('Failed to update item');
                    return;
                }

                setItems(items.map((i) => (i.id === id ? { ...i, ...updatedItemObj } : i)));
                setEditingItemId(null); // Exit editing mode after saving
            })
            .catch((error) => logError('Error while saving item:', error));
    };


    const handleToggleChecked = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const updatedItem = {
            ...item,
            checked: !item.checked,
            completed: !item.checked,
        };

        ShoppingListsService.updateShoppingList({
            id,
            body: updatedItem,
        })
            .then((response) => {
                if (response.hasErrors) {
                    logError('Failed to update item');
                    return;
                }

                setItems(items.map((i) => (i.id === id ? updatedItem : i)));
                setEditingItemId(null);
            })
            .catch((error) => logError('Error while updating item:', error));
    };

    const handleBlur = (id: number) => {
        handleSaveItem(id);
        setEditingItemId(null);
    };



    return (
        <div className="shopping-list-page">
            <div className="container mt-4">
                <h1 className="mb-4">My Shopping List</h1>
                {loading && <p>Loading...</p>}
                {error && <p>Error loading shopping lists.</p>}
                <ul className="list-group">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <li
                                key={item.id}
                                className={`list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'completed' : ''}`}
                            >
                                <div
                                    className="d-flex align-items-center"
                                    style={{ width: '100%' }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => handleToggleChecked(item.id)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    {editingItemId === item.id ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            onBlur={() => handleBlur(item.id)}
                                            className="form-control"
                                            style={{ flexGrow: 1, marginRight: '10px' }}
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                textDecoration: item.completed ? 'line-through' : 'none',
                                                flexGrow: 1,
                                                textAlign: 'center',
                                            }}
                                            onDoubleClick={() => {
                                                setEditingItemId(item.id);
                                                setEditedName(item.name);
                                            }}
                                        >
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">No items found.</li>
                    )}
                    <li className="list-group-item d-flex align-items-center">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={handleAddItem}
                            className="form-control"
                            placeholder="Add a new item..."
                            style={{ width: '100%' }}
                        />
                    </li>
                </ul>
                {items.some((item) => item.checked) && (
                    <div className="mt-4" style={{ textAlign: 'right' }}>
                        <button
                            className="btn btn-danger"
                            style={{ width: 'auto' }}
                            onClick={handleRemoveCheckedItems}
                        >
                            Remove Checked
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingLists;
