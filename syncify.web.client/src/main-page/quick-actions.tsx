import { FaPlus, FaRunning } from 'react-icons/fa';
import { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingListsService } from '../api/generated/ShoppingListsService';
import { useUser } from '../auth/auth-context';
import { toast } from 'react-toastify';
import { ROUTES } from '../routes.tsx';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();

  const handleCreateShoppingList = async () => {
    if (!user?.id) {
      toast.error('User not logged in!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    /*
        If we want the shopping lists to be based off hours minutes seconds in addition to date 
     const now = new Date();
     const formattedDate = ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.toLocaleTimeString()};
     const uniqueName = New Shopping List - ${formattedDate};

      const newItemObj = {
      name: uniqueName,
      description: '',
      userId: user.id,
     };
        */
    const now = new Date();
    const formattedDate = `${
      now.getMonth() + 1
    }/${now.getDate()}/${now.getFullYear()}`;
    const uniqueName = `New Shopping List - ${formattedDate}`;

    const newItemObj = {
      name: uniqueName,
      description: '',
      userId: user.id,
    };

    const response = await ShoppingListsService.createShoppingList({
      body: newItemObj,
    });
    if (response?.data) {
      toast.success('Shopping list created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate(`/shopping-list-items/${response.data.id}`);
    } else {
      toast.error('Failed to create shopping list. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={'card mb-4 shadow dashb'}>
      <div className={'card-header primary-bg text-white hstack gap-2'}>
        <div>
          <FaRunning />
        </div>
        <div>Quick Actions</div>
      </div>
      <div className={'card-body'}>
        <div className={'vstack gap-3'}>
          <div>
            <Link
              className={'icon-link'}
              style={linkStyle}
              to={ROUTES.Calendar.path}
            >
              <FaPlus />
              Add Event
            </Link>
          </div>

          <div>
            <Link
              className={'icon-link'}
              style={linkStyle}
              to={'/family-management'}
            >
              <FaPlus />
              Create Family Invite
            </Link>
          </div>

          <div>
            <div
              className={'icon-link'}
              style={linkStyle}
              onClick={handleCreateShoppingList}
            >
              <FaPlus />
              Create Shopping List
            </div>
          </div>

          <div>
            <Link
              className={'icon-link'}
              style={linkStyle}
              to={'/create-recipe'}
            >
              <FaPlus />
              Create Recipe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const linkStyle: CSSProperties = {
  cursor: 'pointer',
  color: '#0000EE',
  textDecoration: 'none',
};
