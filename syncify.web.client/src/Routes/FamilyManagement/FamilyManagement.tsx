import React, { useEffect, useState } from 'react';
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import { FamilyService } from '../../api/generated/FamilyService';
import { useUser } from '../../auth/auth-context';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import { useAsyncFn } from 'react-use';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FamilyGetDto } from '../../api/generated/index.defs';

export const FamilyManagement = () => {
    const [families, setFamilies] = useState<FamilyGetDto[]>([]);
    const [newFamily, setNewFamily] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showConfirmEditModal, setShowConfirmEditModal] = useState<boolean>(false);
    const [familyToDelete, setFamilyToDelete] = useState<FamilyGetDto | null>(null);
    const [familyToEdit, setFamilyToEdit] = useState<FamilyGetDto | null>(null);
    const [editFamilyName, setEditFamilyName] = useState<string>('');
    const user = useUser();
    const navigate = useNavigate();

    const [{ loading, error }, fetchFamilies] = useAsyncFn(async () => {
        if (user && user.id) {
            const response = await FamilyService.getFamilyOptionsForUser({ userId: user.id });
            const fetchedFamilies = response.data?.map((option: { label: string; value: number }) => ({
                id: option.value,
                name: option.label,
                identifier: '',
                createdByUserId: 0,
            })) || [];
            setFamilies(fetchedFamilies);
        }
    }, [user]);

    useEffect(() => {
        fetchFamilies();
    }, [fetchFamilies]);
    const [, handleAddFamily] = useAsyncFn(async () => {
        if (newFamily.trim() !== '') {
            try {
                const newFamilyObj = await FamilyService.createFamily({ body: { name: newFamily } });
                if (newFamilyObj.hasErrors) {
                    newFamilyObj.errors.forEach((error) => toast.error(error.errorMessage));
                    return;
                }
                if (newFamilyObj.data) {
                    const newFamilyDto = new FamilyGetDto({
                        id: Number(newFamilyObj.data.id),
                        name: newFamilyObj.data.name,
                        identifier: '',
                        createdByUserId: 0,
                    });

                    setFamilies([...families, newFamilyDto]);
                    setNewFamily('');
                    toast.success("Family Created");
                }
            } catch (error) {
                toast.error("An error occurred while creating the family. Please try again.");
            }
        } else {
            toast.warning("Family name cannot be empty.");
        }
    }, [newFamily, families]);

    const [, handleDeleteFamily] = useAsyncFn(async () => {
        if (familyToDelete) {
            try {
                
                const response = await FamilyService.deleteFamily({ id: familyToDelete.id });

                if (response.hasErrors) {
                    response.errors.forEach((error) => toast.error(error.errorMessage));
                    return;
                }
                setFamilies(families.filter(family => family.id !== familyToDelete.id));
                setShowDeleteModal(false);
                toast.success("Family Deleted");
            } catch (error) {
                toast.error("An error occurred while deleting the family. Please try again.");
            }
        }
    }, [familyToDelete, families]);


    const [, handleEditFamily] = useAsyncFn(async () => {
        setShowConfirmEditModal(true);
    }, []);

    const [, confirmEditFamilyName] = useAsyncFn(async () => {
        if (familyToEdit && editFamilyName.trim() !== '') {
            const updatedFamily = await FamilyService.updateFamily({
                id: familyToEdit.id,
                body: { name: editFamilyName },
            });

            if (updatedFamily.errors) {
                toast.error("Family names cannot match");
                return;
            }

            if (updatedFamily.data) {
                setFamilies(families.map(family =>
                    family.id === familyToEdit.id ? { ...family, name: editFamilyName } : family
                ));
                setShowEditModal(false);
                setShowConfirmEditModal(false);
                setFamilyToEdit(null);
                toast.success("Family Name Updated");
            }
        }
    }, [familyToEdit, editFamilyName, families]);

    const handleSelectFamily = (familyId: number) => {
        navigate(`/family-members-management/${familyId}`);
    };

    return (
        <>
            <div className="text-center">
                <h2 className="text-highlight mb-4">My Families</h2>
                <div className="container mt-4">
                    <ul className="list-group">
                        {loading && <li className="list-group-item">Loading...</li>}
                        {error && <li className="list-group-item text-danger">Error loading families.</li>}
                        {families.length > 0 ? (
                            families.map((family) => (
                                <li key={family.id} className="list-group-item d-flex justify-content-between">
                                    <span
                                        className="flex-grow-1 text-start"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSelectFamily(family.id)}>{family.name}</span>
                                    <Dropdown align="end">
                                        <Dropdown.Toggle variant="link" id="family-options">
                                            <FaEllipsisV style={{ color: 'gray', fontSize: '18px' }} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => {
                                                setFamilyToEdit(family);
                                                setEditFamilyName(family.name);
                                                setShowEditModal(true);
                                            }}>
                                                Edit Family
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleSelectFamily(family.id)}>
                                                View Members
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => {
                                                setFamilyToDelete(family);
                                                setShowDeleteModal(true);
                                            }} className="text-danger">
                                                Delete Family
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">No families found.</li>
                        )}
                        <li className="list-group-item d-flex align-items-center">
                            <input
                                type="text"
                                value={newFamily}
                                onChange={(e) => setNewFamily(e.target.value)}
                                className="form-control flex-grow-1"
                                placeholder="Create a new family..."
                            />
                            <Button
                                onClick={handleAddFamily}
                                className="ms-2 d-flex align-items-center justify-content-center"
                                variant="success"
                                style={{ borderRadius: '50%', padding: '0.5rem' }}
                            >
                                <FaPlus className="text-white" />
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the family "{familyToDelete?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteFamily}>
                        Delete Family
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Family Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEditFamilyName">
                            <Form.Label>Family Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editFamilyName}
                                onChange={(e) => setEditFamilyName(e.target.value)}
                                placeholder="Enter new family name"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditFamily}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={showConfirmEditModal} onHide={() => setShowConfirmEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Name Change</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to change the family name to "{editFamilyName}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmEditFamilyName}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
