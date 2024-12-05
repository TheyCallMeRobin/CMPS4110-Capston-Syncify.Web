import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FamilyMemberService } from '../../api/generated/FamilyMemberService';
import { FamilyService } from '../../api/generated/FamilyService';
import {
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { FamilyInviteService } from '../../api/generated/FamilyInviteService';
import { FamilyInviteCreateDto } from '../../api/generated/index.defs';
import { useUser } from '../../auth/auth-context';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAsyncFn } from 'react-use';
import { FaArrowLeft } from 'react-icons/fa';

export const FamilyMemberManagement = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const user = useUser();

  const [fetchFamilyDetails, runFetchFamilyDetails] = useAsyncFn(async () => {
    const familyResponse = await FamilyService.getFamilyById({
      id: Number(familyId),
    });

    if (familyResponse.hasErrors) {
      familyResponse.errors.forEach((error) => toast.error(error.errorMessage));
      return null;
    }

    if (familyResponse.data) {
      const memberResponse = await FamilyMemberService.getFamilyMembers({
        familyId: Number(familyId),
      });

      if (memberResponse.hasErrors) {
        memberResponse.errors.forEach((error) =>
          toast.error(error.errorMessage)
        );
        return null;
      }

      return {
        familyName: familyResponse.data.name,
        createdByUserId: familyResponse.data.createdByUserId,
        members: memberResponse.data || [],
      };
    }

    return null;
  }, [familyId]);

  React.useEffect(() => {
    runFetchFamilyDetails();
  }, [runFetchFamilyDetails]);

  const [inviteModal, setInviteModal] = useState({
    show: false,
    email: '',
    loading: false,
    success: false,
  });

  const [leaveModal, setLeaveModal] = useState({
    show: false,
    memberId: null as number | null,
  });

  const [checkedMembers, setCheckedMembers] = useState<number[]>([]);

  const [{ loading: sendingInvite }, handleInviteSubmit] =
    useAsyncFn(async () => {
      if (!user?.id) {
        toast.error('You must be logged in to send an invite.');
        return;
      }

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
        setInviteModal({ ...inviteModal, success: false, loading: false });
      } else {
        toast.success('Invite sent successfully!');
        setInviteModal({
          show: false,
          email: '',
          success: true,
          loading: false,
        });
      }
    }, [inviteModal, familyId, user]);

  const handleBulkRemove = async () => {
    if (checkedMembers.length === 0) {
      toast.error('No members selected for removal.');
      return;
    }

    await Promise.all(
      checkedMembers.map((memberId) =>
        FamilyMemberService.removeFamilyMember({
          familyMemberId: memberId,
        })
      )
    );

    toast.success('Selected members removed successfully!');
    runFetchFamilyDetails();
    setCheckedMembers([]);
  };

  const toggleMemberChecked = (id: number) => {
    setCheckedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  return (
    <Container>
      <Row className="align-items-center mb-4 text-center">
        <Col>
          <h2 className="text-highlight">Family Members</h2>
          {fetchFamilyDetails.value && (
            <h3 className="text-muted">
              {fetchFamilyDetails.value.familyName}
            </h3>
          )}
        </Col>
      </Row>

      {fetchFamilyDetails.loading ? (
        <Row>
          <Col className="text-center">
            <p>Loading family members...</p>
          </Col>
        </Row>
      ) : fetchFamilyDetails.error ? (
        <Row>
          <Col className="text-center">
            <p className="text-danger">Error loading family details.</p>
          </Col>
        </Row>
      ) : fetchFamilyDetails.value ? (
        <>
          <Row className="mt-3">
            <Col style={{ textAlign: 'left', padding: '10px' }}>
              <div className="actions-container">
                <Button
                  className="btn btn-secondary return-button"
                  variant="secondary"
                  onClick={() => (window.location.href = '/family-management')}
                >
                  <FaArrowLeft style={{ marginRight: '8px' }} /> Return to
                  Family Management
                </Button>
              </div>
            </Col>
            {fetchFamilyDetails.value?.createdByUserId === user?.id && (
              <Col
                style={{
                  textAlign: 'right',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <div className="actions-container">
                  <Button
                    className="btn btn-danger bulk-delete-button"
                    style={{
                      marginRight: '0px',
                      padding: '10p',
                    }}
                    variant="danger"
                    onClick={handleBulkRemove}
                    disabled={checkedMembers.length === 0}
                  >
                    Remove Checked
                  </Button>
                </div>
              </Col>
            )}
          </Row>
          <Row>
            <Col>
              <ListGroup>
                {fetchFamilyDetails.value.members.map((member) => (
                  <ListGroup.Item
                    key={member.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {member.userFirstName} {member.userLastName}
                    </div>

                    {fetchFamilyDetails.value?.createdByUserId === user?.id && (
                      <div>
                        <input
                          type="checkbox"
                          className="form-check-input ms-3"
                          checked={checkedMembers.includes(member.id)}
                          onChange={() => toggleMemberChecked(member.id)}
                        />
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-3 justify-content-end">
            <Col xs="auto">
              <Button
                variant="outline-danger"
                onClick={() =>
                  setLeaveModal({ show: true, memberId: user?.id || null })
                }
                className="me-3"
              >
                Leave
              </Button>
              <Button
                variant="primary"
                onClick={() => setInviteModal({ ...inviteModal, show: true })}
              >
                Invite New Member
              </Button>
            </Col>
          </Row>

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
                  if (leaveModal.memberId) {
                    toggleMemberChecked(leaveModal.memberId);
                    setLeaveModal({ show: false, memberId: null });
                  }
                }}
              >
                Leave
              </Button>
            </Modal.Footer>
          </Modal>

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
                  <Form.Label>Email Address or Phone Number</Form.Label>
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
        </>
      ) : null}
    </Container>
  );
};
