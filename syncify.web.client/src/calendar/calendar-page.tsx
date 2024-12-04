import React from 'react';
import { Calendar } from './calendar.tsx';
import { CalendarDrawer } from './calendar-drawer.tsx';

export const CalendarPage: React.FC = () => {
  return (
    <div className={'row'}>
      <div className={'mt-4'}>
        <div>
          <CalendarDrawer />
        </div>
        <Calendar />
      </div>
    </div>
  );
};
