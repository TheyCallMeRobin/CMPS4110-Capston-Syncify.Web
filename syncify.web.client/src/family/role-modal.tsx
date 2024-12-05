import { z } from 'zod';
import {
  ChangeMemberRoleDto,
  FamilyMemberGetDto,
  FamilyMemberRole,
} from '../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { useAsyncFn } from 'react-use';
import { FamilyMemberService } from '../api/generated/FamilyMemberService.ts';
import { toast } from 'react-toastify';
import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { zodResolver } from '@hookform/resolvers/zod';
import { notify } from '../hooks/use-subscription.ts';

const schema = z.object({
  familyMemberId: z.number(),
  role: z.nativeEnum(FamilyMemberRole),
}) satisfies z.Schema<ChangeMemberRoleDto>;

type ChangeMemberRoleSchema = z.TypeOf<typeof schema>;

type RoleModalProps = {
  open: boolean;
  familyMember: FamilyMemberGetDto;
  onClose: () => void;
};

export const RoleModal: React.FC<RoleModalProps> = ({
  open,
  familyMember,
  onClose,
}) => {
  const { register, handleSubmit } = useForm<ChangeMemberRoleSchema>({
    defaultValues: {
      familyMemberId: familyMember.id,
      role: familyMember.role,
    },
    resolver: zodResolver(schema),
  });

  const [, changeMemberRole] = useAsyncFn(
    async (values: ChangeMemberRoleSchema) => {
      const response = await FamilyMemberService.changeMemberRole({
        body: { ...values },
      });
      if (response.hasErrors) {
        response.errors.forEach((error) => toast.error(error.errorMessage));
        return;
      }

      notify('family-members-refresh', undefined);
      toast.success("Member's role has been changed");
      notify('family-refresh', undefined);
      onClose();
    }
  );

  return (
    <Modal show={open}>
      <Modal.Header>
        <h5>Change Member Role</h5>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(changeMemberRole)}>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select {...register('role')}>
              {familyMember.role === FamilyMemberRole.Owner && (
                <option value={FamilyMemberRole.Owner}>
                  {FamilyMemberRole.Owner}
                </option>
              )}
              <option value={FamilyMemberRole.Admin}>
                {FamilyMemberRole.Admin}
              </option>
              <option value={FamilyMemberRole.Member}>
                {FamilyMemberRole.Member}
              </option>
            </Form.Select>
          </Form.Group>
          <div className={'clearfix'}>
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
                <button type={'submit'} className={'btn btn-primary float-end'}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
