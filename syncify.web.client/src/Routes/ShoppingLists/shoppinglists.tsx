import React, { useState, useEffect } from 'react';
import './shoppinglists.css';
import { logError } from '../../utils/logger';

interface ShoppingItem {
    id: number;
    name: string;
    completed: boolean;
    checked: boolean;
}

export const ShoppingLists: React.FC = () => {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItem, setNewItem] = useState<string>('');

    // Fetch shopping list items from the backend
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/api/shoppinglists');
                const { data } = await response.json();  // Extract the 'data' property
                logError('Fetched items:', data);  // Log the fetched data
                setItems(Array.isArray(data) ? data : []);  // Ensure it's an array
            } catch (error) {
                logError('Error fetching shopping list items:', error);
            }
        };

        fetchItems();
    }, []);

    // Add a new item to the list (POST to backend)
    const handleAddItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
            try {
                const response = await fetch('/api/shoppinglists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newItem })  // Only name is required for creation
                });
                const addedItem = await response.json();
                setItems([...items, addedItem.data]);  // Make sure to add the new item correctly
                setNewItem('');  // Clear the input after adding
            } catch (error) {
                logError('Error adding item:', error);
            }
        }
    };

    // Delete checked items (DELETE from backend)
    const handleRemoveCheckedItems = async () => {
        const confirmed = window.confirm('Are you sure you want to remove all checked items?');
        if (confirmed) {
            try {
                const checkedItems = items.filter(item => item.checked);
                for (const item of checkedItems) {
                    await fetch(`/api/shoppinglists/${item.id}`, {
                        method: 'DELETE'
                    });
                }
                // Remove checked items from the list
                setItems(items.filter(item => !item.checked));
            } catch (error) {
                logError('Error removing items:', error);
            }
        }
    };

    // Toggle checkbox state (PATCH to backend)
    const handleToggleChecked = async (id: number) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, checked: !item.checked, completed: !item.checked } : item
        );
        setItems(updatedItems);  // Update the state locally

        try {
            const updatedItem = updatedItems.find(item => item.id === id);
            if (updatedItem) {
                await fetch(`/api/shoppinglists/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: updatedItem.name,  // Ensure the name is sent, as it's part of the object
                        completed: updatedItem.completed,
                        checked: updatedItem.checked
                    })
                });
            }
        } catch (error) {
            logError('Error updating item:', error);
        }
    };

    // Update an item name (PATCH to backend)
    const handleUpdateItemName = async (id: number, newName: string) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, name: newName } : item
        );
        setItems(updatedItems);  // Update the state locally

        try {
            const updatedItem = updatedItems.find(item => item.id === id);
            if (updatedItem) {
                await fetch(`/api/shoppinglists/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: updatedItem.name,
                        completed: updatedItem.completed,
                        checked: updatedItem.checked
                    })
                });
            }
        } catch (error) {
            logError('Error updating item name:', error);
        }
    };

    return (
        <div className="shopping-list-page">
            {/* Main Content */}
            <div className="container mt-4">
                <h1 className="mb-4">My Shopping List</h1>

                {/* Shopping List Items */}
                <ul className="list-group">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'completed' : ''}`}
                        >
                            {/* Align checkbox to the left */}
                            <div className="d-flex align-items-center" style={{ width: '100%' }}>
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleToggleChecked(item.id)}
                                    style={{ marginRight: '10px' }}  // Adds space between checkbox and text
                                />
                                {/* Center the text content */}
                                <span
                                    style={{
                                        textDecoration: item.completed ? 'line-through' : 'none',
                                        flexGrow: 1,  // Ensures the text takes up available space
                                        textAlign: 'center'  // Centers the text horizontally
                                    }}
                                >
                                    {item.name}
                                </span>
                            </div>
                        </li>
                    ))}

                    {/* Add New Item at the Bottom (as part of the list) */}
                    <li className="list-group-item d-flex align-items-center">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={handleAddItem}  // Adds item when Enter is pressed
                            className="form-control"
                            placeholder="Add a new item..."
                            style={{ width: '100%' }}  // Make input field take up the full width
                        />
                    </li>
                </ul>

                {/* Remove Checked Button */}
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
