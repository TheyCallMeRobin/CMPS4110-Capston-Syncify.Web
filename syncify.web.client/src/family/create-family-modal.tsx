import { z } from 'zod';
import { FamilyCreateDto } from '../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAsyncFn } from 'react-use';
import { FamilyService } from '../api/generated/FamilyService.ts';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Form, Modal } from 'react-bootstrap';
import { notify } from '../hooks/use-subscription.ts';

const schema = z.object({
  name: z.string().trim().min(1, { message: 'Name must not be empty.' }),
}) satisfies z.Schema<FamilyCreateDto>;

type FamilyCreateSchema = z.TypeOf<typeof schema>;

export const CreateFamilyModal: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilyCreateSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
    },
    shouldUnregister: true,
  });

  const [, createFamily] = useAsyncFn(async (values: FamilyCreateSchema) => {
    const response = await FamilyService.createFamily({ body: { ...values } });

    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }

    toast.success('Family created.');
    closeModal();
    notify('family-refresh', undefined);
  });

  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <button className={'btn btn-link mb-2'} onClick={openModal}>
        <FaPlus className={'mx-1'} />
        Create a family
      </button>
      {isModalOpen && (
        <Modal show={isModalOpen}>
          <Modal.Header>
            <Modal.Title>Create a Family</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(createFamily)}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size={'lg'}
                  type={'text'}
                  {...register('name')}
                  isInvalid={!!errors.name}
                />
                {errors.name && (
                  <p style={{ color: 'red' }}>{errors.name?.message}</p>
                )}
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
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
