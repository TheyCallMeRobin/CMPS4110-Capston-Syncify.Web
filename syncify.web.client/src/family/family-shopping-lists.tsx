import { FaShoppingCart } from 'react-icons/fa';
import React, { useState } from 'react';
import { useAsyncFn, useAsyncRetry } from 'react-use';
import { FamilyShoppingListService } from '../api/generated/FamilyShoppingListService.ts';
import { toast } from 'react-toastify';
import { FamilyShoppingListGetDto } from '../api/generated/index.defs.ts';
import { AddShoppingListModal } from './add-shopping-list-modal.tsx';
import { DeleteConfirmationModal } from '../Components/delete-confirmation-modal.tsx';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FaEllipsis, FaPencil, FaTrash } from 'react-icons/fa6';
import { notify } from '../hooks/use-subscription.ts';

type FamilyShoppingListsProps = {
  familyId: number;
};

export const FamilyShoppingLists: React.FC<FamilyShoppingListsProps> = ({
  familyId,
}) => {
  const navigate = useNavigate();

  const fetchShoppingLists = useAsyncRetry(async () => {
    const response = await FamilyShoppingListService.getFamilyShoppingLists({
      familyId,
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return [] as FamilyShoppingListGetDto[];
    }

    return response.data as FamilyShoppingListGetDto[];
  }, [familyId]);

  const [selectedShoppingList, setSelectedShoppingList] =
    useState<FamilyShoppingListGetDto>();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [, deleteShoppingList] = useAsyncFn(
    async (shoppingList: FamilyShoppingListGetDto) => {
      const response =
        await FamilyShoppingListService.removeShoppingListFromFamily({
          id: shoppingList.id,
        });

      if (response.hasErrors) {
        response.errors.forEach((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Shopping list removed from family.');
      closeDeleteModal();
      notify('family-refresh', undefined);
    }
  );

  const openDeleteModal = (shoppingList: FamilyShoppingListGetDto) => {
    setSelectedShoppingList(shoppingList);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedShoppingList(undefined);
    setShowDeleteModal(false);
  };

  const goToShoppingList = (id: number) => {
    navigate(`/shopping-list-items/${id}`);
  };

  return (
    <div className={'card'}>
      <div className="card-header primary-bg text-white">
        <div className={'hstack gap-3'}>
          <div className={'hstack gap-2'}>
            <div>
              <FaShoppingCart />
            </div>
            <div>Shopping Lists</div>
          </div>
          <div className={'ms-auto'}>
            <AddShoppingListModal familyId={familyId} />
          </div>
        </div>
      </div>
      <div className={'card-body'}>
        {!fetchShoppingLists.loading &&
        (fetchShoppingLists.value?.length ?? 0) <= 0 ? (
          <>There are no shopping lists in this family.</>
        ) : (
          <table className={'table table-striped'}>
            <thead>
              <tr>
                <th>Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {fetchShoppingLists.value?.map((shoppingList) => (
                <tr key={shoppingList.shoppingListId}>
                  <td className={'align-content-center'}>
                    {shoppingList.shoppingList.name}
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
                          onClick={() =>
                            goToShoppingList(shoppingList.shoppingListId)
                          }
                        >
                          <span className="hstack gap-3 ms-auto m-1">
                            <FaPencil />
                            View
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => openDeleteModal(shoppingList)}
                        >
                          <span
                            className="hstack gap-3 ms-auto m-1"
                            style={{ color: 'red' }}
                          >
                            <FaTrash />
                            Delete
                          </span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedShoppingList && (
        <DeleteConfirmationModal
          onDelete={() => deleteShoppingList(selectedShoppingList)}
          visible={showDeleteModal}
          onCancel={closeDeleteModal}
          headerText={'Remove Family Shopping List'}
          modalText={
            'Are you sure you want to remove this shopping list from this family?'
          }
        />
      )}
    </div>
  );
};
