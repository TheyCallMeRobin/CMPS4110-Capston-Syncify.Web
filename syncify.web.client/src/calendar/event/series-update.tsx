import { Modal } from 'react-bootstrap';

type SeriesUpdateConfirmationProps = {
  open: boolean;
  onClose: () => void;
  onSelectSingle: () => Promise<void>;
};

export const SeriesUpdateConfirmation: React.FC<
  SeriesUpdateConfirmationProps
> = (props) => {
  const { open, onClose, onSelectSingle } = props;

  const handleSelectSingle = async () => {
    await onSelectSingle();
    onClose();
  };

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <h5>Edit Event</h5>
      </Modal.Header>
      <Modal.Body>
        <div className={'d-flex flex-column gap-2'}>
          <p>
            Would you like to update only this event or all events linked to
            this one?
          </p>
          <div className={'d-flex flex-row justify-content-between'}>
            <button
              className={'btn btn-secondary'}
              onClick={handleSelectSingle}
            >
              Just this event
            </button>
            <button className={'btn btn-primary'} onClick={onClose}>
              All events
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
