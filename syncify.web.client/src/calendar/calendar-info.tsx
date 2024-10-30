import { useUser } from '../auth/auth-context.tsx';
import { CalendarGetDto } from '../api/generated/index.defs.ts';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { FaPencil } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { useAsync } from 'react-use';
import { CalendarsService } from '../api/generated/CalendarsService.ts';
import { toast } from 'react-toastify';
import React from 'react';

export const CalendarInfo: React.FC = () => {
  const user = useUser();

  const fetchCalendars = useAsync(async () => {
    const response = await CalendarsService.getByUserWithFamilies({
      userId: user?.id ?? 0,
    });

    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return [] as CalendarGetDto[];
    }
    return response.data as CalendarGetDto[];
  }, [user?.id]);

  return (
    <>
      {fetchCalendars.value?.map((calendar) => (
        <CalendarRow calendar={calendar} />
      ))}
    </>
  );
};

const CalendarRow: React.FC<{ calendar: CalendarGetDto }> = ({ calendar }) => {
  return (
    <div className={'hstack gap-2'}>
      <div>
        <CheckBoxComponent className={'e-info'} cssClass={'e-info'} />
      </div>
      <div>{calendar.name}</div>
      <div className={'ms-auto hstack gap-1'}>
        <div>
          <button className={'icon-button'}>
            <FaPencil color={'#0b60b0'} />
          </button>
        </div>
        <div>
          <button className={'icon-button'}>
            <FaTrash color={'red'} />
          </button>
        </div>
      </div>
    </div>
  );
};
