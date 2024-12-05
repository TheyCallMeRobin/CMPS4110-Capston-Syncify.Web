import { useAsync, useAsyncFn } from 'react-use';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { notify } from '../hooks/use-subscription.ts';
import { FaBook } from 'react-icons/fa';
import { FaEllipsis, FaPencil, FaTrash } from 'react-icons/fa6';
import { DeleteConfirmationModal } from '../Components/delete-confirmation-modal.tsx';
import { FamilyRecipeService } from '../api/generated/FamilyRecipeService.ts';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AddFamilyRecipeModal } from './add-family-recipe-modal.tsx';
import { FamilyMemberRole } from '../api/generated/index.defs.ts';

type FamilyRecipesProps = {
  familyId: number;
  memberRole: FamilyMemberRole;
};

export const FamilyRecipes: React.FC<FamilyRecipesProps> = ({
  familyId,
  memberRole,
}) => {
  const navigate = useNavigate();

  const fetchRecipes = useAsync(async () => {
    const response = await FamilyRecipeService.getFamilyRecipes({
      familyId,
    });
    return response.data;
  });

  const [selectedRecipeId, setSelectedRecipeId] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [, removeRecipeFromFamily] = useAsyncFn(async (id: number) => {
    const response = await FamilyRecipeService.removeRecipeFromFamily({
      id,
    });

    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return;
    }

    toast.success('Recipe removed from family.');
    closeDeleteModal();
    notify('family-refresh', undefined);
  });

  const openDeleteModal = (id: number) => {
    setSelectedRecipeId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedRecipeId(0);
    setDeleteModalOpen(false);
  };

  const goToRecipe = (recipeId: number) => navigate(`view-recipe/${recipeId}`);

  return (
    <div className={'card'}>
      <div className="card-header primary-bg text-white">
        <div className={'hstack gap-3'}>
          <div className={'hstack gap-2'}>
            <div>
              <FaBook />
            </div>
            <div>Recipes</div>
          </div>
          {memberRole !== FamilyMemberRole.Member && (
            <div className={'ms-auto'}>
              <AddFamilyRecipeModal familyId={familyId} />
            </div>
          )}
        </div>
      </div>
      <div className={'card-body'}>
        {!fetchRecipes.loading && (fetchRecipes.value?.length ?? 0 > 0) ? (
          <table className={'table table-striped'}>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {fetchRecipes.value?.map((recipe) => (
                <tr key={recipe.recipeId} className={'align-content-center'}>
                  <td className={'align-content-center'}>
                    {recipe.recipe.name}
                  </td>
                  <td className={'align-content-center'}>
                    <Dropdown className={'clearfix'}>
                      <Dropdown.Toggle
                        variant="link"
                        size="lg"
                        className={'float-end'}
                      >
                        <FaEllipsis />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => goToRecipe(recipe.recipeId)}
                        >
                          <span className="hstack gap-3 ms-auto m-1">
                            <FaPencil />
                            View
                          </span>
                        </Dropdown.Item>
                        {memberRole !== FamilyMemberRole.Member && (
                          <Dropdown.Item
                            onClick={() => openDeleteModal(recipe.id)}
                          >
                            <span
                              className="hstack gap-3 ms-auto m-1"
                              style={{ color: 'red' }}
                            >
                              <FaTrash />
                              Delete
                            </span>
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>There are no recipes in this family.</>
        )}
      </div>
      <DeleteConfirmationModal
        visible={deleteModalOpen}
        onDelete={() => removeRecipeFromFamily(selectedRecipeId)}
        headerText={'Remove Recipe from Family'}
        modalText={
          'Are you sure you want to remove this recipe from the family?'
        }
        onCancel={closeDeleteModal}
      />
    </div>
  );
};
