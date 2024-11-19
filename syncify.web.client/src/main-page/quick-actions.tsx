import { FaPlus, FaRunning } from 'react-icons/fa';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  return (
    <div>
      <div className={'card-header primary-bg text-white hstack gap-2'}>
        <div>
          <FaRunning />
        </div>
        <div>Quick Actions</div>
      </div>
      <div className={'card-body'}>
        <div className={'vstack gap-3 justify-content-start'}>
          <div>
            <Link className={'icon-link'} style={linkStyle} to={'/calendars'}>
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
            <Link
              className={'icon-link'}
              style={linkStyle}
              to={'/shopping-lists'}
            >
              <FaPlus />
              Create Shopping List
            </Link>
          </div>
          <div>
            <Link className={'icon-link'} style={linkStyle} to={'/recipes'}>
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
  textDecoration: 'none',
  cursor: 'pointer',
};
