import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FamilyMemberService } from '../../api/generated/FamilyMemberService';
import { FamilyMemberGetDto } from '../../api/generated/index.defs';
import { FamilyService } from '../../api/generated/FamilyService';
import {
  Button,
  Modal,
  Form,
  Spinner,
  Container,
  Row,
  Col,
  ListGroup,
} from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import { FamilyInviteService } from '../../api/generated/FamilyInviteService';
import { FamilyInviteCreateDto } from '../../api/generated/index.defs';
import { useUser } from '../../auth/auth-context';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAsyncFn } from 'react-use';

export const FamilyMemberManagement = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const [data, setData] = useState({
    familyName: '',
    createdByUserId: null as number | null,
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
  const [leaveModal, setLeaveModal] = useState({
    show: false,
    memberId: null as number | null,
  });

  const user = useUser();

  const fetchFamilyDetails = async () => {
    if (familyId) {
      setData({ ...data, loading: true });

      const familyResponse = await FamilyService.getFamilyById({
        id: Number(familyId),
      });

      if (familyResponse.data) {
        const memberResponse = await FamilyMemberService.getFamilyMembers({
          familyId: Number(familyId),
        });

        setData({
          familyName: familyResponse.data.name,
          createdByUserId: familyResponse.data.createdByUserId,
          members: memberResponse.data || [],
          loading: false,
          error: null,
        });
      } else {
        setData({
          ...data,
          loading: false,
          error: 'Failed to load family details',
        });
      }
    }
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, [familyId]);

  const [{ loading: sendingInvite }, handleInviteSubmit] =
    useAsyncFn(async () => {
      if (!user?.id) {
        toast.error('You must be logged in to send an invite.');
        return;
      }

      setInviteModal({
        ...inviteModal,
        loading: true,
        error: null,
        success: false,
      });

      const inviteData: FamilyInviteCreateDto = {
        inviteQuery: inviteModal.email,
        familyId: Number(familyId),
        sentByUserId: user.id,
        expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const response = await FamilyInviteService.createInvite({
        body: inviteData,
      });

      if (response.hasErrors) {
        toast.error(
          response.errors[0]?.errorMessage || 'Failed to send invite.'
        );
        setInviteModal({
          ...inviteModal,
          loading: false,
          error: 'Failed to send invite.',
          success: false,
        });
      } else {
        toast.success('Invite sent successfully!');
        setInviteModal({
          show: false,
          email: '',
          loading: false,
          error: null,
          success: true,
        });
      }
    }, [inviteModal, familyId, user]);

  const [, handleRemoveMember] = useAsyncFn(
    async (memberId: number) => {
      const response = await FamilyMemberService.removeFamilyMember({
        familyMemberId: memberId,
      });

      if (response.hasErrors) {
        toast.error('Failed to remove the member.');
        return;
      }

      setData((prevData) => ({
        ...prevData,
        members: prevData.members.filter((member) => member.id !== memberId),
      }));

      if (memberId === user?.id) {
        toast.success('You have left the family.');
      } else {
        toast.success('Member removed successfully!');
      }
    },
    [data, user]
  );

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
              <h3>
                {data.familyName ? data.familyName : 'Family Name not found'}
              </h3>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <ListGroup>
                {data.members.length > 0 ? (
                  data.members.map((member) => (
                    <ListGroup.Item
                      key={member.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {member.userFirstName} {member.userLastName}
                      </span>

                      {member.userId === user?.id ? (
                        <Button
                          style={{
                            backgroundColor: 'red',
                            color: 'white',
                            borderColor: 'red',
                          }}
                          onClick={() => {
                            setLeaveModal({ show: true, memberId: member.id });
                          }}
                        >
                          Leave
                        </Button>
                      ) : data.createdByUserId === user?.id ? (
                        <Button
                          variant="danger"
                          onClick={() =>
                            setRemoveModal({ show: true, memberId: member.id })
                          }
                        >
                          <FaTrashAlt />
                        </Button>
                      ) : null}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center">
                    No members found.
                  </ListGroup.Item>
                )}
              </ListGroup>

              <Row className="mt-3">
                <Col className="text-end">
                  <Button
                    variant="primary"
                    onClick={() =>
                      setInviteModal({ ...inviteModal, show: true })
                    }
                  >
                    Invite New Member
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          <Modal
            show={inviteModal.show}
            onHide={() => setInviteModal({ ...inviteModal, show: false })}
            centered
          >
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
                    onChange={(e) =>
                      setInviteModal({ ...inviteModal, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setInviteModal({ ...inviteModal, show: false })}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleInviteSubmit}>
                {sendingInvite ? 'Sending...' : 'Send Invite'}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={leaveModal.show}
            onHide={() => setLeaveModal({ show: false, memberId: null })}
            centered
          >
            <Modal.Header>
              <Modal.Title>Leave Family</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to leave this family? You will no longer
              have access to its content.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setLeaveModal({ show: false, memberId: null })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (leaveModal.memberId)
                    handleRemoveMember(leaveModal.memberId);
                  setLeaveModal({ show: false, memberId: null });
                }}
              >
                Leave
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={removeModal.show}
            onHide={() => setRemoveModal({ show: false, memberId: null })}
            centered
          >
            <Modal.Header>
              <Modal.Title>Remove Family Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to remove this member from the family?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setRemoveModal({ show: false, memberId: null })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (removeModal.memberId)
                    handleRemoveMember(removeModal.memberId);
                  setRemoveModal({ show: false, memberId: null });
                }}
              >
                Remove
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Container>
  );
};
