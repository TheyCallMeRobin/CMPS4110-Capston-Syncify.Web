import React, { useState, useEffect } from 'react';
import './shoppinglists.css';

const ShoppingLists = () => {
    // Initialize state for items and newItem
    const [items, setItems] = useState<{ id: number, name: string, checked: boolean, completed: boolean }[]>([]);
    const [newItem, setNewItem] = useState<string>('');

    useEffect(() => {
        const fetchItems = () => {
            fetch('/api/shoppinglist')
                .then(response => response.json())
                .then(data => {
                    setItems(Array.isArray(data) ? data : []);
                })
                .catch(() => {
                    setItems([]);
                });
        };
        fetchItems();
    }, []);

    // Stubs for the necessary event handlers
    const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
            const newItemObj = {
                id: items.length + 1,  // Fake ID for demonstration
                name: newItem,
                checked: false,
                completed: false
            };
            setItems([...items, newItemObj]);  // Add the new item
            setNewItem('');  // Clear the input
        }
    };

    const handleToggleChecked = (id: number) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, checked: !item.checked, completed: !item.checked } : item
        );
        setItems(updatedItems);  // Update the state locally
    };

    const handleRemoveCheckedItems = () => {
        const confirmed = window.confirm('Are you sure you want to remove all checked items?');
        if (confirmed) {
            setItems(items.filter(item => !item.checked));  // Remove checked items
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
