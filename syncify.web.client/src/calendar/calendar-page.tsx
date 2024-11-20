import React from 'react';
import { Calendar } from './calendar.tsx';
import { CalendarFilter } from './calendar-filter.tsx';
import { CreateCalendar } from './create-calendar.tsx';

export const CalendarPage: React.FC = () => {
  return (
    <div className={'vh-100'} style={{ minHeight: '110%' }}>
      <div className={'mt-4'}>
        <div className={'hstack'}>
          <div>
            <CalendarFilter />
          </div>
          <div className={'ms-auto'}>
            <CreateCalendar />
          </div>
        </div>
        <Calendar />
      </div>
    </div>
  );
};
