import React, { useState, useEffect, useContext } from 'react';
import './shoppinglists.css';
import { MyAppContext } from '../../Context/MyAppContext';
import { logError } from '../../utils/logger';

const ShoppingLists = () => {
    const [items, setItems] = useState<{ id: number, name: string, checked: boolean, completed: boolean }[]>([]);
    const [newItem, setNewItem] = useState<string>('');
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string>('');

    const appContext = useContext(MyAppContext);
    const userId = appContext?.user?.id;

    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchItems = () => {
            fetch(`/api/shoppinglist/by-user/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch shopping lists');
                    }
                    return response.json();
                })
                .then(result => {
                    setItems(Array.isArray(result.data) ? result.data : []);
                })
                .catch(error => {
                    logError('Error fetching shopping list:', error);
                    setItems([]);
                });
        };
        fetchItems();
    }, [userId]);

    const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
            const newItemObj = {
                name: newItem,
                description: '',
                userId: userId,
                completed: false,
                checked: false
            };

            fetch('/api/shoppinglist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItemObj),
            })
                .then(res => res.json())
                .then(createdItem => {
                    setItems([...items, createdItem.data]);
                    setNewItem('');
                })
                .catch(error => logError('Error while adding item:', error));
        }
    };

    const handleSaveItem = (id: number) => {
        const updatedItemObj = {
            name: editedName,
            userId: userId
        };

        fetch(`/api/shoppinglist/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItemObj),
        })
            .then(response => response.json())
            .then(() => {
                const updatedItems = items.map(item =>
                    item.id === id ? { ...item, name: editedName } : item
                );
                setItems(updatedItems);
                setEditingItemId(null);
            })
            .catch(error => logError('Error while saving changes:', error));
    };

    const handleBlur = (id: number) => {
        handleSaveItem(id);
        setEditingItemId(null);
    };

    const handleToggleChecked = (id: number) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, checked: !item.checked, completed: !item.checked } : item
        );
        setItems(updatedItems);
    };

    const handleRemoveCheckedItems = () => {
        const confirmed = window.confirm('Are you sure you want to remove all checked items?');
        if (confirmed) {
            const checkedItems = items.filter(item => item.checked);

            checkedItems.forEach(item => {
                fetch(`/api/shoppinglist/${item.id}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (response.ok) {
                            setItems(currentItems => currentItems.filter(i => i.id !== item.id));
                        } else {
                            logError('Failed to delete item:', item.id);
                        }
                    })
                    .catch(error => logError('Error while deleting item:', error));
            });
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
                                className={`list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'completed' : ''}`}
                            >
                                <div className="d-flex align-items-center" style={{ width: '100%' }}>
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
                                            onBlur={() => handleBlur(item.id)} // Save and close on blur
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
                                            }}  // Open edit mode on double-click
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

                    {/* Add New Item Input Field */}
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

                {/* Remove Checked Items Button */}
                {items.some(item => item.checked) && (
                    <div className="mt-4" style={{ textAlign: 'right' }}>
                        <button className="btn btn-danger" style={{ width: 'auto' }} onClick={handleRemoveCheckedItems}>
                            Remove Checked
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingLists;
