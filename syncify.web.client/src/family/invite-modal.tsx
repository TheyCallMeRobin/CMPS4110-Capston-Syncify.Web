import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { z } from 'zod';
import { FamilyInviteCreateDto } from '../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { useAsyncFn } from 'react-use';
import { FamilyInviteService } from '../api/generated/FamilyInviteService.ts';
import { zodResolver } from '@hookform/resolvers/zod';

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
    }
  );

  return (
    <Modal show={open} className={'clearfix'}>
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
                    type={'text'}
                    {...register('inviteQuery')}
                    placeholder={'Enter an email address or a phone number'}
                  />
                  <p style={{ color: 'red' }}>{errors.inviteQuery?.message}</p>
                </Form.Group>
              </div>
            </div>
            <div className={'row'}>
              <div className={'clearfix'}>
                <button
                  type={'button'}
                  className={'btn btn-secondary float-left'}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type={'submit'}
                  className={'btn btn-primary float-right'}
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
