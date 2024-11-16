import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './shoppinglistitems.css';
import { ShoppingListItemService } from '../../api/generated/ShoppingListItemService';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService';
import { ShoppingListItemGetDto, ShoppingListItemCreateDto } from '../../api/generated/index.defs';
import { Dropdown } from 'react-bootstrap';
import { FaEllipsisV, FaPen, FaTrashAlt, FaPlusSquare } from 'react-icons/fa';

const ShoppingListItems: React.FC = () => {
    const { listId } = useParams<{ listId: string }>();
    const [items, setItems] = useState<ShoppingListItemGetDto[]>([]);
    const [units] = useState<string[]>([
        "count", "tsp", "tbsp", "cup", "pint", "quart", "gallon",
        "ml", "l", "oz", "lb", "g", "kg", "mg", "pinch", "dash",
        "fl oz", "piece"
    ]);
    const [newItem, setNewItem] = useState({ name: "", unit: "", quantity: 1 });
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [listName, setListName] = useState<string>("");
    const [isBulkDeleteVisible, setIsBulkDeleteVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchItemsAndListName = async () => {
            if (listId) {
                const shoppingListId = parseInt(listId);
                const itemsResponse = await ShoppingListItemService.getShoppingListItems({ shoppingListId });
                setItems(itemsResponse.data || []);

                const listResponse = await ShoppingListsService.getShoppingListById({ id: shoppingListId });
                if (listResponse.data) setListName(listResponse.data.name);
            }
        };

        fetchItemsAndListName();
    }, [listId]);

    const handleAddItem = async () => {
        if (!listId || !newItem.name.trim() || !newItem.unit) return;

        const newItemData: ShoppingListItemCreateDto = {
            name: newItem.name,
            shoppingListId: parseInt(listId),
            unit: newItem.unit,
            quantity: newItem.quantity,
            isChecked: false,
        };

        const createdResponse = await ShoppingListItemService.createShoppingListItem({
            body: newItemData,
        });

        if (createdResponse.data) {
            setItems([...items, createdResponse.data]);
            setNewItem({ name: "", unit: "", quantity: 1 });
        }
    };

    const handleEditItem = (item: ShoppingListItemGetDto) => {
        setEditingItemId(item.id);
        setNewItem({ name: item.name, unit: item.unit, quantity: item.quantity });
    };

    const handleSaveItem = async (id: number) => {
        const updatedItem = items.find((i) => i.id === id);
        if (!updatedItem) return;

        const itemData = { ...updatedItem, ...newItem };
        await ShoppingListItemService.updateShoppingListItem({ id, body: itemData });
        setItems(items.map((i) => (i.id === id ? itemData : i)));
        setEditingItemId(null);
        setNewItem({ name: "", unit: "", quantity: 1 });
    };

    const handleDeleteItem = async (id: number) => {
        await ShoppingListItemService.deleteShoppingListItem({ id });
        setItems(items.filter((item) => item.id !== id));
    };

    const toggleItemChecked = (id: number) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, isChecked: !item.isChecked } : item
            )
        );

        const anyChecked = items.some((item) => item.id === id ? !item.isChecked : item.isChecked);
        setIsBulkDeleteVisible(anyChecked);
    };

    const handleBulkDelete = async () => {
        const checkedItems = items.filter((item) => item.isChecked);
        await Promise.all(
            checkedItems.map((item) => ShoppingListItemService.deleteShoppingListItem({ id: item.id }))
        );
        setItems(items.filter((item) => !item.isChecked));
        setIsBulkDeleteVisible(false); // Hide trash can after deletion
    };

    return (
        <div className="shopping-list-items-page">
            <h2>Items for {listName} List</h2>
            {isBulkDeleteVisible && (
                <div className="bulk-delete-container">
                    <FaTrashAlt
                        onClick={handleBulkDelete}
                        style={{ cursor: 'pointer', color: 'red', fontSize: '1rem', marginRight: '1rem' }}
                        title="Delete Selected"
                    />
                </div>
            )}
            <div className="shopping-list-items">
                {items.map((item) => (
                    <div key={item.id} className="shopping-list-item-row">
                        <Dropdown className="shopping-list-item-menu-dropdown">
                            <Dropdown.Toggle as="div" className="shopping-list-menu-icon">
                                <FaEllipsisV />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEditItem(item)}>
                                    <FaPen style={{ marginRight: '10px', color: 'green' }} />
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDeleteItem(item.id)}>
                                    <FaTrashAlt style={{ marginRight: '10px', color: 'red' }} />
                                    Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        {editingItemId === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="form-control item-edit-input"
                                />
                                <select
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                    className="form-control item-edit-select"
                                >
                                    <option value="">Select unit</option>
                                    {units.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                    className="form-control item-edit-quantity"
                                />
                                <button onClick={() => handleSaveItem(item.id)} className="btn btn-save">Save</button>
                            </>
                        ) : (
                            <>
                                <div className={`column item-name ${item.isChecked ? 'checked' : ''}`}>
                                    {item.name}
                                </div>
                                <div className="column item-unit">{item.unit}</div>
                                <div className="column item-quantity">Qty: {item.quantity}</div>
                                <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={() => toggleItemChecked(item.id)}
                                    className="item-checkbox"
                                />
                            </>
                        )}
                    </div>
                ))}
                <div className="add-item-container">
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Enter item name"
                        className="form-control name-input"
                    />
                    <select
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        className="form-control unit-input"
                    >
                        <option value="">Select unit</option>
                        {units.map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                        className="form-control quantity-input"
                        min="1"
                    />
                    <div className="shopping-list-item-add" onClick={handleAddItem}>
                        <FaPlusSquare className="add-icon" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingListItems;
