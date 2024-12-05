import { FaPlus } from 'react-icons/fa';
import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { z } from 'zod';
import {
  FamilyShoppingListCreateDto,
  OptionDto,
} from '../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAsync, useAsyncFn } from 'react-use';
import { FamilyShoppingListService } from '../api/generated/FamilyShoppingListService.ts';
import { useUser } from '../auth/auth-context.tsx';
import { ShoppingListsService } from '../api/generated/ShoppingListsService.ts';
import { toast } from 'react-toastify';
import { notify } from '../hooks/use-subscription.ts';

type AddShoppingListModalProps = {
  familyId: number;
};

const schema = z.object({
  familyId: z.number(),
  shoppingListId: z.number(),
}) satisfies z.Schema<FamilyShoppingListCreateDto>;

type FamilyShoppingListCreateSchema = z.TypeOf<typeof schema>;

export const AddShoppingListModal: React.FC<AddShoppingListModalProps> = ({
  familyId,
}) => {
  const user = useUser();

  const [addModalOpen, setAddModalOpen] = useState(false);

  const closeModal = () => setAddModalOpen(false);

  const fetchOptions = useAsync(async () => {
    const response = await ShoppingListsService.getOptions({
      userId: user?.id ?? 0,
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return [] as OptionDto[];
    }

    return response.data as OptionDto[];
  }, [user?.id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilyShoppingListCreateSchema>({
    defaultValues: {
      familyId,
    },
    resolver: zodResolver(schema),
  });

  const [, addShoppingList] = useAsyncFn(
    async (values: FamilyShoppingListCreateSchema) => {
      const response = await FamilyShoppingListService.createFamilyShoppingList(
        { body: { ...values } }
      );

      if (response.hasErrors) {
        response.errors.forEach((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Shopping list added.');
      closeModal();
      notify('family-refresh', undefined);
    }
  );

  return (
    <>
      <button
        className={
          'btn btn-primary-transparent d-flex flex-row gap-2 align-content-center'
        }
        style={{ color: 'white' }}
        onClick={() => setAddModalOpen(true)}
      >
        <div>
          <FaPlus />
        </div>
        Add Shopping List
      </button>
      <Modal show={addModalOpen}>
        <Modal.Header>
          <Modal.Title>Add Family Shopping List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!fetchOptions.loading && (fetchOptions.value?.length ?? 0) !== 0 ? (
            <Form onSubmit={handleSubmit(addShoppingList)}>
              <Form.Group>
                <Form.Label>Shopping List</Form.Label>
                <Form.Select
                  {...register('shoppingListId', { valueAsNumber: true })}
                >
                  {fetchOptions.value?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
                {errors.shoppingListId && (
                  <p>{errors.shoppingListId?.message}</p>
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
          ) : (
            <>
              You don't have any shopping lists that can be added to this
              family.
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
    </>
  );
};
