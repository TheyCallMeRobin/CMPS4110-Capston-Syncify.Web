import React, { CSSProperties } from 'react';

type LoadingContainerProps = {
  loading?: boolean;
  children?: React.ReactNode;
};

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  loading,
  children,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      {loading ? (
        <div style={overlayStlye}>
          <div className={'spinner-border text-primary'}>
            <span className={'visually-hidden'}>...</span>
          </div>
        </div>
      ) : (
        <> {children} </>
      )}
    </div>
  );
};

const overlayStlye: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(211, 211, 211, 0.15)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};
