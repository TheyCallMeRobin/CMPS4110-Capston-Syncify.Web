import React, { useState } from 'react';
import './shoppinglists.css';
import './../../index.css';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService.ts';
import { ShoppingListGetDto, ShoppingListUpdateDto } from '../../api/generated/index.defs.ts';
import { useUser } from '../../auth/auth-context.tsx';
import { useAsync } from 'react-use';
import { FaTrashAlt } from 'react-icons/fa';

const ShoppingLists = () => {
    const [items, setItems] = useState<ShoppingListGetDto[]>([]);
    const [newItem, setNewItem] = useState<string>('');
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string>('');
    const user = useUser();

    const { loading, error } = useAsync(async () => {
        if (!user?.id) return;

        const response = await ShoppingListsService.getShoppingListsByUserId({
            userId: user!.id,
        });

        setItems(response.data || []);
    }, [user]);

    const handleAddItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
            const newItemObj = {
                name: newItem,
                description: '',
                userId: user!.id,
            };

            const response = await ShoppingListsService.createShoppingList({
                body: newItemObj,
            });

            if (response.data) {
                setItems([...items, response.data]);
                setNewItem('');
            }
        }
    };

    const handleDeleteItem = async (id: number) => {
        await ShoppingListsService.deleteShoppingList({ id });
        setItems(items.filter((item) => item.id !== id));
    };

    const handleSaveItem = async (id: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const updatedItemObj: ShoppingListUpdateDto = {
            name: editedName,
            description: item.description,
        };

        const response = await ShoppingListsService.updateShoppingList({
            id,
            body: updatedItemObj,
        });

        if (response.errors) {
            return;
        }

        setItems(items.map((i) => (i.id === id ? { ...i, ...updatedItemObj } : i)));
        setEditingItemId(null);
    };

    const handleBlur = (id: number) => {
        handleSaveItem(id);
        setEditingItemId(null);
    };

    return (
        <div className="page-content">
          <h2 className="text-center text-highlight mb-4">My Shopping Lists</h2>
            <div className="shopping-list-page container mt-4">
              {loading && <p>Loading...</p>}
              {error && <p>Error loading shopping lists.</p>}
                <div>
                  <ul className="list-group">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                        <div className="d-flex align-items-center" style={{ width: '100%' }}>
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
                                flexGrow: 1,
                                textAlign: 'left',
                              }}
                              onDoubleClick={() => {
                                setEditingItemId(item.id);
                                setEditedName(item.name);
                              }}
                            >
                              {item.name}
                            </span>
                          )}
                          <button
                            className="btn"
                            onClick={() => handleDeleteItem(item.id)}
                            style={{ marginLeft: '10px' }}
                          >
                          <FaTrashAlt
                            className="trash-icon"
                            style={{ color: 'red', fontSize: '18px' }}
                          />
                          </button>
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
                      placeholder="Add a new list..."
                      style={{ width: '100%' }}
                    />
                  </li>
                </ul>
              </div>
            </div>
        </div>
    );
};

export default ShoppingLists;