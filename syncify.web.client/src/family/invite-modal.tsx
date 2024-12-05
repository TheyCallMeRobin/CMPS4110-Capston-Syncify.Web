import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { z } from 'zod';
import { FamilyInviteCreateDto } from '../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { useAsyncFn } from 'react-use';
import { FamilyInviteService } from '../api/generated/FamilyInviteService.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

type InviteModal = {
  open: boolean;
  onClose: () => void;
  familyId: number;
};

const schema = z.object({
  familyId: z.number(),
  inviteQuery: z
    .string()
    .trim()
    .min(1, { message: 'This field must not be blank' }),
}) satisfies z.Schema<FamilyInviteCreateDto>;

type CreateFamilyInviteSchema = z.TypeOf<typeof schema>;

export const InviteModal: React.FC<InviteModal> = ({
  open,
  onClose,
  familyId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFamilyInviteSchema>({
    defaultValues: {
      familyId,
      inviteQuery: '',
    },
    resolver: zodResolver(schema),
  });

  const [, createInvite] = useAsyncFn(
    async (values: CreateFamilyInviteSchema) => {
      const response = await FamilyInviteService.createInvite({
        body: { ...values },
      });
      if (response.hasErrors) {
        response.errors.forEach((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Invite created.');
    }
  );

  return (
    <Modal show={open}>
      <Modal.Header>
        <h5>Create Family Invite</h5>
      </Modal.Header>
      <Modal.Body>
        <div className={'grid'}>
          <Form onSubmit={handleSubmit(createInvite)}>
            <div className={'row'}>
              <div className={'col-md-12'}>
                <Form.Group>
                  <Form.Label column={false}>
                    Email Address or Phone Number
                  </Form.Label>
                  <Form.Control
                    size={'lg'}
                    type={'text'}
                    {...register('inviteQuery')}
                    placeholder={'Enter an email address or a phone number'}
                  />
                  <p style={{ color: 'red' }}>{errors.inviteQuery?.message}</p>
                </Form.Group>
              </div>
            </div>
            <div className={'row'}>
              <div className={'col-md-12'}>
                <div className={'clearfix'}>
                  <div className={'float-start'}>
                    <button
                      type={'button'}
                      className={'btn btn-secondary float-start'}
                      onClick={onClose}
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
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
