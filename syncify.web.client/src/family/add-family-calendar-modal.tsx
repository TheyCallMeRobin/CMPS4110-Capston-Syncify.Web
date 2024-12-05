import { useAsync, useAsyncFn } from 'react-use';
import { toast } from 'react-toastify';
import { notify } from '../hooks/use-subscription.ts';
import { z } from 'zod';
import { FamilyCalendarCreateDto } from '../api/generated/index.defs.ts';
import { FamilyCalendarService } from '../api/generated/FamilyCalendarService.ts';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '../auth/auth-context.tsx';

type AddFamilyCalendarModalProps = {
  familyId: number;
};

const schema = z.object({
  calendarId: z.number(),
  familyId: z.number(),
}) satisfies z.Schema<FamilyCalendarCreateDto>;

type FamilyCalendarCreateSchema = z.TypeOf<typeof schema>;

export const AddFamilyCalendarModal: React.FC<AddFamilyCalendarModalProps> = ({
  familyId,
}) => {
  const user = useUser();

  const [, createFamily] = useAsyncFn(
    async (values: FamilyCalendarCreateSchema) => {
      const response = await FamilyCalendarService.addCalendarToFamily({
        body: { ...values },
      });

      if (response.hasErrors) {
        response.errors.forEach((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Family created.');
      closeModal();
      notify('family-refresh', undefined);
    }
  );

  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const { register, handleSubmit } = useForm<FamilyCalendarCreateSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      familyId,
    },
  });

  const fetchOptions = useAsync(async () => {
    const response = await FamilyCalendarService.getOptions({
      userId: user?.id ?? 0,
    });

    return response.data;
  }, [user?.id]);

  return (
    <>
      <button
        className={
          'btn btn-primary-transparent d-flex flex-row gap-2 align-content-center'
        }
        style={{ color: 'white' }}
        onClick={() => setModalOpen(true)}
      >
        <div>
          <FaPlus />
        </div>
        Add Calendar
      </button>
      {isModalOpen && (
        <Modal show={isModalOpen}>
          <Modal.Header>
            <Modal.Title>Add a Calendar to Family</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!fetchOptions.loading && (fetchOptions.value?.length ?? 0) > 0 ? (
              <Form onSubmit={handleSubmit(createFamily)}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Select {...register('familyId')}>
                    {fetchOptions.value?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        opt.label
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <div className={'mt-3 clearfix'}>
                  <div className={'clearfix'}>
                    <div className={'float-start'}>
                      <button
                        type={'button'}
                        className={'btn btn-secondary float-start'}
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className={'float-end'}>
                      <button
                        type={'submit'}
                        className={'btn btn-primary float-end'}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            ) : (
              <>
                You don't have any calendars that can be added to this family.
                <div className={'clearfix'}>
                  <button
                    className={'btn btn-secondary float-start'}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
