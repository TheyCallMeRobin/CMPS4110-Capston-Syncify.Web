import './calendar-drawer.css';
import { useToggle } from 'react-use';
import { Offcanvas } from 'react-bootstrap';
import React from 'react';
import { useCalendarFilterStore } from './calendar-filter-store.ts';
import { CalendarInfo } from './info/calendar-info.tsx';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { notify } from '../hooks/use-subscription.ts';

export const CalendarDrawer: React.FC = () => {
  const [on, toggle] = useToggle(false);

  const dirty = useCalendarFilterStore((state) => state.dirty);

  const setDirty = useCalendarFilterStore((state) => state.setDirty);

  const handleClose = () => {
    toggle(false);

    if (dirty) {
      notify('calendar-refresh', undefined);
    }
    setDirty(false);
  };

  const filterLoading = useCalendarFilterStore((state) => state.loading);

  return (
    <LoadingContainer loading={filterLoading}>
      <div className={'p-2'}>
        <button className={'btn btn-primary'} onClick={() => toggle(true)}>
          Calendars
        </button>
      </div>
      <Offcanvas show={on} onHide={handleClose} style={{ maxWidth: '100%' }}>
        <Offcanvas.Header closeButton={true}>
          <Offcanvas.Title>Calendars</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CalendarInfo />
        </Offcanvas.Body>
      </Offcanvas>
    </LoadingContainer>
  );
};
