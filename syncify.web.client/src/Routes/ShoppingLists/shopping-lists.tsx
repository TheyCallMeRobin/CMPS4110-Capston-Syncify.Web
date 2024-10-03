import React, { useEffect, useState } from 'react';
import './shoppinglists.css';
import { logError } from '../../utils/logger';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService.ts';
import { ShoppingListCreateDto } from '../../api/generated/index.defs.ts';
import { useUser } from '../../auth/auth-context.tsx';

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

    const user = useUser();

    useEffect(() => {
        if (!user?.id) return;

        const fetchItems = async () => {
            try {
                const response = await ShoppingListsService.getShoppingListsByUserId({
                    userId: Number(user?.id),
                });
                if (response.hasErrors)
                    throw new Error('Failed to fetch shopping lists');
                const validItems = Array.isArray(response.data)
                    ? response.data.map((item) => ({
                        ...item,
                        checked: item.checked ?? false,
                        completed: item.completed ?? false,
                    }))
                    : [];

                setItems(validItems);
            } catch (error) {
                logError('Error fetching shopping list:', error);
                setItems([]);
            }
        };

        fetchItems();
    }, [user?.id]);

    const handleAddItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
            const newItemObj: ShoppingListCreateDto = {
                name: newItem,
                description: '',
                userId: Number(user?.id),
            };

            try {
                const response = await ShoppingListsService.createShoppingList({
                    body: newItemObj,
                });
                if (response.hasErrors)
                    throw new Error('Failed to create shopping list item');

                if (response.data) {
                    setItems([
                        ...items,
                        { ...response.data, checked: false, completed: false },
                    ]);
                }
                setNewItem('');
            } catch (error) {
                logError('Error while adding item:', error);
            }
        }
    };

    const handleSaveItem = async (id: number) => {
        const updatedItemObj = {
            name: editedName,
            description: '',
            userId: Number(user?.id),
        };

        try {
            const response = await ShoppingListsService.updateShoppingList({
                id,
                body: updatedItemObj,
            });
            if (response.hasErrors)
                throw new Error('Failed to update shopping list item');
            const updatedItems = items.map((item) =>
                item.id === id ? { ...item, name: editedName } : item
            );
            setItems(updatedItems);
            setEditingItemId(null);
        } catch (error) {
            logError('Error while saving changes:', error);
        }
    };

    const handleBlur = (id: number) => {
        handleSaveItem(id);
        setEditingItemId(null);
    };

    const handleToggleChecked = async (id: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const updatedItem = {
            ...item,
            checked: !item.checked,
            completed: !item.checked,
        };

        try {
            const response = await ShoppingListsService.updateShoppingList({
                id,
                body: updatedItem,
            });
            if (response.hasErrors) throw new Error('Failed to update item');

            setItems(items.map((i) => (i.id === id ? updatedItem : i)));
        } catch (error) {
            logError('Error while updating item:', error);
        }
    };

    const handleRemoveCheckedItems = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to remove all checked items?'
        );
        if (confirmed) {
            const checkedItems = items.filter((item) => item.checked);

            try {
                for (const item of checkedItems) {
                    const response = await ShoppingListsService.deleteShoppingList({
                        id: item.id,
                    });
                    if (response.hasErrors)
                        throw new Error(`Failed to delete item: ${item.id}`);
                }
                setItems((currentItems) =>
                    currentItems.filter((item) => !item.checked)
                );
            } catch (error) {
                logError('Error while deleting item:', error);
            }
        }
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