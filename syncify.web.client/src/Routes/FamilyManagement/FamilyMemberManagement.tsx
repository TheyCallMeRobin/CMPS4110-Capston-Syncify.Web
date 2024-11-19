import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FamilyMemberService } from '../../api/generated/FamilyMemberService';
import { FamilyMemberGetDto } from '../../api/generated/index.defs';
import { FamilyService } from '../../api/generated/FamilyService';
import { FamilyGetDto } from '../../api/generated/index.defs';
import { Button, Modal, Form, Spinner, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import { FamilyInviteService } from '../../api/generated/FamilyInviteService';
import { FamilyInviteCreateDto } from '../../api/generated/index.defs';
import { useUser } from '../../auth/auth-context';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAsyncFn } from 'react-use';

export const FamilyMemberManagement = () => {
    const { familyId } = useParams<{ familyId: string }>();
    const [data, setData] = useState({
        familyName: '',
        members: [] as FamilyMemberGetDto[],
        loading: true,
        error: null as string | null,
    });
    const [inviteModal, setInviteModal] = useState({
        show: false,
        email: '',
        loading: false,
        error: null as string | null,
        success: false,
    });
    const [removeModal, setRemoveModal] = useState({
        show: false,
        memberId: null as number | null,
    });

    const user = useUser();

    const [, fetchFamilyDetails] = useAsyncFn(async () => {
        if (familyId) {
            try {
                const familyResponse = await FamilyService.getFamilyById({ id: Number(familyId) });

                if (familyResponse.data) {
                    const family: FamilyGetDto = familyResponse.data;
                    const memberResponse = await FamilyMemberService.getFamilyMembers({ familyId: Number(familyId) });
                    setData({
                        familyName: family.name,
                        members: memberResponse.data || [],
                        loading: false,
                        error: null,
                    });
                }
            } catch (err) {
                setData({ ...data, loading: false, error: 'Failed to load family details' });
            }
        }
    }, [familyId]);

    useEffect(() => {
        fetchFamilyDetails();
    }, [fetchFamilyDetails]);

    const [, handleInviteSubmit] = useAsyncFn(async () => {
        if (!user?.id) {
            setInviteModal({ ...inviteModal, error: 'You must be logged in to send an invite.' });
            return;
        }

        setInviteModal({ ...inviteModal, loading: true, error: null, success: false });

        if (!inviteModal.email) return;

        try {
            const inviteData = new FamilyInviteCreateDto({
                inviteQuery: inviteModal.email,
                familyId: Number(familyId),
                sentByUserId: user.id,
            });

            const inviteResponse = await FamilyInviteService.createInvite({
                body: inviteData,
            });

            if (inviteResponse.data) {
                setInviteModal({ show: false, email: '', loading: false, error: null, success: true });
                toast.success('Invite sent successfully!');
            }
        } catch (err) {
            setInviteModal({ ...inviteModal, loading: false, error: 'Failed to send invite.' });
            toast.error('Failed to send invite.');
        }
    }, [inviteModal, familyId, user]);

    const [, handleRemoveMember] = useAsyncFn(async (familyMemberId: number) => {
        try {
            await FamilyMemberService.removeFamilyMember({ familyMemberId });
            setData({ ...data, members: data.members.filter(member => member.id !== familyMemberId) });
            toast.success('Member removed successfully!');
        } catch (err) {
            toast.error('Failed to remove member.');
        }
    }, [data]);

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="text-highlight mb-4 text-center">Family Members</h2>
                </Col>
            </Row>

            {data.loading ? (
                <Row>
                    <Col className="text-center">
                        <p>Loading family members...</p>
                    </Col>
                </Row>
            ) : data.error ? (
                <Row>
                    <Col className="text-danger text-center">
                        <p>{data.error}</p>
                    </Col>
                </Row>
            ) : (
                <>
                    <Row>
                        <Col className="text-center">
                            <h3>{data.familyName ? data.familyName : 'Family Name not found'}</h3>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col>
                            <ListGroup>
                                {data.members.length > 0 ? (
                                    data.members.map((member) => (
                                        <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
                                            <span>{member.userFirstName} {member.userLastName}</span>
                                            <Button
                                                variant="danger"
                                                onClick={() => setRemoveModal({ show: true, memberId: member.id })}
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item className="text-center">
                                        No members found.
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col className="text-end">
                            <Button variant="primary" onClick={() => setInviteModal({ ...inviteModal, show: true })}>
                                Invite New Member
                            </Button>
                        </Col>
                    </Row>

                    <Modal show={inviteModal.show} onHide={() => setInviteModal({ ...inviteModal, show: false })} centered>
                        <Modal.Header>
                            <Modal.Title>Invite a New Member</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="inviteEmail">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={inviteModal.email}
                                        onChange={(e) => setInviteModal({ ...inviteModal, email: e.target.value })}
                                    />
                                </Form.Group>
                                {inviteModal.error && <p className="text-danger">{inviteModal.error}</p>}
                                {inviteModal.success && <p className="text-success">Invite sent successfully!</p>}
                            </Form>
                            {inviteModal.loading && (
                                <div className="d-flex justify-content-center mt-3">
                                    <Spinner animation="border" />
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setInviteModal({ ...inviteModal, show: false })}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleInviteSubmit}>
                                Send Invite
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={removeModal.show} onHide={() => setRemoveModal({ show: false, memberId: null })} centered>
                        <Modal.Header>
                            <Modal.Title>Remove Family Member</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to remove this member from the family?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setRemoveModal({ show: false, memberId: null })}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={() => {
                                if (removeModal.memberId) handleRemoveMember(removeModal.memberId);
                                setRemoveModal({ show: false, memberId: null });
                            }}>
                                Remove Member
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}

            <ToastContainer />
        </Container>
    );
};