import { useUser } from '../auth/auth-context.tsx';
import { useAsync, useAsyncFn } from 'react-use';
import { toast } from 'react-toastify';
import { notify } from '../hooks/use-subscription.ts';
import React, { useMemo, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaPlus } from 'react-icons/fa';
import { Form, Modal } from 'react-bootstrap';
import { z } from 'zod';
import { FamilyRecipeCreateDto } from '../api/generated/index.defs.ts';
import { FamilyRecipeService } from '../api/generated/FamilyRecipeService.ts';

type AddFamilyRecipeModalProps = {
  familyId: number;
};

const schema = z.object({
  recipeId: z.number(),
  familyId: z.number(),
}) satisfies z.Schema<FamilyRecipeCreateDto>;

type FamilyRecipeCreateSchema = z.TypeOf<typeof schema>;

export const AddFamilyRecipeModal: React.FC<AddFamilyRecipeModalProps> = ({
  familyId,
}) => {
  const user = useUser();

  const [, createFamilyRecipe] = useAsyncFn(
    async (values: FamilyRecipeCreateSchema) => {
      const response = await FamilyRecipeService.createFamilyRecipe({
        body: { ...values },
      });

      if (response.hasErrors) {
        response.errors.forEach((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Recipe added to Family.');
      closeModal();
      notify('family-refresh', undefined);
    }
  );

  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setValue('familyId', familyId);
    setModalOpen(true);
  };

  const defaultValues: DefaultValues<FamilyRecipeCreateSchema> = useMemo(
    () => ({
      familyId: familyId,
    }),
    [familyId]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FamilyRecipeCreateSchema>({
    resolver: zodResolver(schema),
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });

  const fetchOptions = useAsync(async () => {
    const response = await FamilyRecipeService.getOptions({
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
        onClick={openModal}
      >
        <div>
          <FaPlus />
        </div>
        Add Recipe
      </button>
      {isModalOpen && (
        <Modal show={isModalOpen}>
          <Modal.Header>
            <Modal.Title>Add a Recipe to Family</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!fetchOptions.loading && (fetchOptions.value?.length ?? 0) > 0 ? (
              <Form onSubmit={handleSubmit(createFamilyRecipe)}>
                <Form.Group>
                  <Form.Label className="form-required">Name</Form.Label>
                  <Form.Select
                    {...register('recipeId', { valueAsNumber: true })}
                  >
                    {fetchOptions.value?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.familyId && (
                    <p style={{ color: 'red' }}>{errors.familyId?.message}</p>
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
