import { FaPlus, FaRunning } from 'react-icons/fa';
import { CSSProperties } from 'react';

export const QuickActions: React.FC = () => {
  return (
    <div className={'card mb-4 shadow dashboard-card'}>
      <div className={'card-header primary-bg text-white hstack gap-2'}>
        <div>
          <FaRunning />
        </div>
        <div>Quick Actions</div>
      </div>
      <div className={'card-body'}>
        <div className={'vstack gap-3'}>
          <div>
            <a className={'icon-link'} style={linkStyle}>
              <FaPlus />
              Add Event
            </a>
          </div>
          <div>
            <a className={'icon-link'} style={linkStyle}>
              <FaPlus />
              Create Family Invite
            </a>
          </div>
          <div>
            <a className={'icon-link'} style={linkStyle}>
              <FaPlus />
              Create Shopping List
            </a>
          </div>
          <div>
            <a className={'icon-link'} style={linkStyle}>
              <FaPlus />
              Create Recipe
            </a>
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
