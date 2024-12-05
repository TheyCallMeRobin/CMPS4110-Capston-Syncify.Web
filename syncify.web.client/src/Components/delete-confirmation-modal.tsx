import { Modal } from 'react-bootstrap';
import React from 'react';

type DeleteConfirmationModal = {
  headerText?: string;
  modalText?: string;
  visible?: boolean;
  onCancel?: () => any;
  onDelete: () => any;
};

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModal> = ({
  headerText = 'Delete',
  modalText = 'Are you sure you want to delete this?',
  visible,
  onCancel,
  onDelete,
}) => {
  return (
    <Modal show={visible}>
      <Modal.Header>
        <h5>{headerText}</h5>
      </Modal.Header>
      <Modal.Body>
        <div className={'grid'}>
          <div className={'row'}>
            <div className={'col-md-12'}>
              <p>{modalText}</p>
            </div>
          </div>
          <div className={'row'}>
            <div className={'col-md-6'}>
              <button className={'btn btn-secondary'} onClick={onCancel}>
                Cancel
              </button>
            </div>
            <div className={'col-md-6'}>
              <button className={'btn btn-danger'} onClick={onDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
