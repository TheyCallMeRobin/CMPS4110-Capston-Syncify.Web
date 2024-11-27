import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './shoppinglists.css';
import './../../index.css';
import { ShoppingListsService } from '../../api/generated/ShoppingListsService';
import { ShoppingListItemService } from '../../api/generated/ShoppingListItemService';
import { ShoppingListGetDto, ShoppingListItemGetDto, ShoppingListUpdateDto } from '../../api/generated/index.defs';
import { useUser } from '../../auth/auth-context';
import { useAsync } from 'react-use';
import { FaTrashAlt, FaEllipsisV, FaPen, FaEye, FaPlusSquare } from 'react-icons/fa';
import { Dropdown, Modal, Button } from 'react-bootstrap';

const ShoppingLists: React.FC = () => {
    const [items, setItems] = useState<ShoppingListGetDto[]>([]);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState<string>('');
    const [previewItems, setPreviewItems] = useState<Record<number, (ShoppingListItemGetDto | string)[]>>({});
    const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null as number | null });
    const user = useUser();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const { loading, error } = useAsync(async () => {
        if (!user?.id) return;

        const response = await ShoppingListsService.getShoppingListsByUserId({
            userId: user!.id,
        });

        const lists = response.data || [];
        setItems(lists);

        const previews: Record<number, (ShoppingListItemGetDto | string)[]> = {};
        await Promise.all(
            lists.map(async (list) => {
                const itemsResponse = await ShoppingListItemService.getShoppingListItems({
                    shoppingListId: list.id,
                });
                const items = itemsResponse.data || [];

                if (items.length > 3) {
                    previews[list.id] = [...items.slice(0, 3), ". . ."];
                } else {
                    previews[list.id] = items;
                }
            })
        );
        setPreviewItems(previews);
    }, [user]);

    const handleAddItem = async () => {
        if (!user?.id) return;

        const newItemObj = {
            name: "Enter List Name",
            description: '',
            userId: user.id,
        };

        const response = await ShoppingListsService.createShoppingList({
            body: newItemObj,
        });

        if (response.data) {
            setItems([...items, response.data]);
            setEditingItemId(response.data.id);
            setEditedName("");
        }
    };

    const handleDeleteItem = async (id: number) => {
        await ShoppingListsService.deleteShoppingList({ id });
        setItems(items.filter((item) => item.id !== id));
        setDeleteModal({ show: false, itemId: null });
    };

    const handleSaveItem = async (id: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const updatedItemObj: ShoppingListUpdateDto = {
            name: editedName,
            description: item.description,
        };

        await ShoppingListsService.updateShoppingList({
            id,
            body: updatedItemObj,
        });

        setItems(items.map((i) => (i.id === id ? { ...i, ...updatedItemObj } : i)));
        setEditingItemId(null);
    };

    const handleEditItem = (id: number, name: string) => {
        setEditingItemId(id);
        setEditedName(name);
    };

    useEffect(() => {
        if (editingItemId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingItemId]);

    return (
        <div className="shopping-list-page">
            <h2 className="text-center text-highlight mb-4">My Shopping Lists</h2>
            <div className="shopping-list-container">
                {loading && <p>Loading...</p>}
                {error && <p>Error loading shopping lists.</p>}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="shopping-list-item"
                    >
                        <Dropdown className="shopping-list-menu-dropdown">
                            <Dropdown.Toggle as="div" className="shopping-list-menu-icon">
                                <FaEllipsisV />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate(`/shopping-list-items/${item.id}`)}>
                                    <FaEye style={{ marginRight: '10px', color: 'blue' }} />
                                    View
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleEditItem(item.id, item.name)}>
                                    <FaPen style={{ marginRight: '10px', color: 'green' }} />
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setDeleteModal({ show: true, itemId: item.id })}>
                                    <FaTrashAlt style={{ marginRight: '10px', color: 'red' }} />
                                    Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <div className={`shopping-list-title-container ${editingItemId === item.id ? 'editing' : ''}`}>
                            {editingItemId === item.id ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onBlur={() => handleSaveItem(item.id)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveItem(item.id)}
                                    className="form-control"
                                    autoFocus
                                    ref={inputRef}
                                />
                            ) : (
                                <h2 className="shopping-list-title">{item.name}</h2>
                            )}
                        </div>
                        <div
                            className="shopping-list-preview-container"
                            onClick={() => navigate(`/shopping-list-items/${item.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <ul className="shopping-list-preview">
                                {previewItems[item.id]?.map((previewItem, index) =>
                                    typeof previewItem === "string" ? (
                                        <li key={index} className="preview-item">. . .</li>
                                    ) : (
                                        <li key={previewItem.id} className="preview-item">
                                            {previewItem.name}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
                <div className="shopping-list-add" onClick={handleAddItem}>
                    <FaPlusSquare className="add-icon" />
                </div>
            </div>

            <Modal show={deleteModal.show} onHide={() => setDeleteModal({ show: false, itemId: null })} centered>
                <Modal.Header>
                    <Modal.Title>Delete Shopping List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this shopping list? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModal({ show: false, itemId: null })}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            if (deleteModal.itemId) handleDeleteItem(deleteModal.itemId);
                        }}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ShoppingLists;