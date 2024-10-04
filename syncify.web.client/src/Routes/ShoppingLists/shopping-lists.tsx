import React, { useEffect, useState } from 'react';
import './shoppinglists.css';
import { logError } from '../../utils/logger';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService.ts';
import { ShoppingListCreateDto } from '../../api/generated/index.defs.ts';
import { AuthenticationService } from '../../api/generated/AuthenticationService.ts';

const ShoppingLists = () => {
    const [items, setItems] = useState<
        {
            id: number;
            name: string;
            description: string;
            checked: boolean;
            completed: boolean;
        }[]
    >([]);
    const [newItem, setNewItem] = useState<string>('');
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string>('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        
        AuthenticationService.me()
            .then((response) => {
                if (response.hasErrors || !response.data) {
                    logError('Failed to fetch user data');
                    return;
                }
                setUser(response.data);
            })
            .catch((error) => logError('Error fetching user:', error));
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        ShoppingListsService.getShoppingListsByUserId({
            userId: Number(user?.id),
        })
            .then((response) => {
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
            })
            .catch((error) => {
                logError('Error fetching shopping list:', error);
                setItems([]);
            });
    }, [user?.id]);

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
            })
            .catch((error) => logError('Error while updating item:', error));
    };

    const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
            const newItemObj: ShoppingListCreateDto = {
                name: newItem,
                description: '',
                userId: Number(user?.id),
            };

            ShoppingListsService.createShoppingList({
                body: newItemObj,
            })
                .then((response) => {
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
                })
                .catch((error) => logError('Error while adding item:', error));
        }
    };

    const handleRemoveCheckedItems = () => {
        const confirmed = window.confirm(
            'Are you sure you want to remove all checked items?'
        );
        if (confirmed) {
            const checkedItems = items.filter((item) => item.checked);

            const deletePromises = checkedItems.map((item) =>
                ShoppingListsService.deleteShoppingList({
                    id: item.id,
                })
            );

            Promise.all(deletePromises)
                .then((responses) => {
                    responses.forEach((response, index) => {
                        if (response.hasErrors) {
                            logError(`Failed to delete item: ${checkedItems[index].id}`);
                        }
                    });

                    setItems((currentItems) =>
                        currentItems.filter((item) => !item.checked)
                    );
                })
                .catch((error) => logError('Error while deleting item:', error));
        }
    };

    const handleSaveItem = (id: number) => {
        const updatedItemObj = {
            name: editedName,
            description: '',
            userId: Number(user?.id),
        };

        ShoppingListsService.updateShoppingList({
            id,
            body: updatedItemObj,
        })
            .then((response) => {
                if (response.hasErrors) {
                    logError('Failed to update shopping list item');
                    return;
                }

                const updatedItems = items.map((item) =>
                    item.id === id ? { ...item, name: editedName } : item
                );
                setItems(updatedItems);
                setEditingItemId(null); // Close editing mode
            })
            .catch((error) => logError('Error while saving changes:', error));
    };


    const handleBlur = (id: number) => {
        handleSaveItem(id);
        setEditingItemId(null);
    };


    return (
        <div className="shopping-list-page">
            <div className="container mt-4">
                <h1 className="mb-4">My Shopping List</h1>
                <ul className="list-group">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <li
                                key={item.id}
                                className={`list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'completed' : ''
                                    }`}
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
                                                textDecoration: item.completed
                                                    ? 'line-through'
                                                    : 'none',
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
