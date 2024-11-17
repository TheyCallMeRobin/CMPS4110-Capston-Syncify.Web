import { useUser } from '../auth/auth-context.tsx';
import { useAsync, useAsyncFn } from 'react-use';
import { toast } from 'react-toastify';
import React, { CSSProperties } from 'react';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { CalendarEventService } from '../api/generated/CalendarEventService.ts';
import { cardStyle } from './MainPage.tsx';
import { CalendarEventGetDto } from '../api/generated/index.defs.ts';
import { FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const TodaysTodos: React.FC = () => {
  const user = useUser();

  const [, updateStatus] = useAsyncFn(async (event: CalendarEventGetDto) => {
    const response = await CalendarEventService.updateTaskStatus({
      id: event.id,
      body: { isCompleted: !event.isCompleted },
    });
    toast.dismiss();
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }
    toast.success('To-do status updated.');
  });

  const fetchTodaysTodos = useAsync(async () => {
    const response = await CalendarEventService.getTodaysTodosByUserId({
      userId: user?.id ?? 0,
    });

    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return;
    }

    return response.data;
  }, [user]);

  const TodosDisplay = () => {
    if (!fetchTodaysTodos.value || fetchTodaysTodos.value?.length <= 0) {
      return <>There are no to-do items for today.</>;
    }
    return (
      <>
        <table className={'table'}>
          <thead>
            <tr>
              <th />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fetchTodaysTodos.value?.map((event) => {
              return (
                <tr
                  key={event.id}
                  className={event.isCompleted ? 'strikethrough' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      className={'form-check-'}
                      style={checkboxStyle}
                      onChange={async () => {
                        await updateStatus(event);
                        event.isCompleted = !event.isCompleted;
                      }}
                    />
                  </td>
                  <td>{event.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <>
      <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
        <div className={'card-header primary-bg text-white hstack gap-2'}>
          <div>
            <FaClipboardList />
          </div>
          <div>Today's To-Do List</div>
        </div>
        <div className={'card-body'}>
          <LoadingContainer loading={fetchTodaysTodos.loading}>
            <div className={'vstack gap-3'}>
              <div>
                <TodosDisplay />
              </div>
               <div>
                <Link to="/calendars" className={'btn btn-primary'}>
                  View All To-Dos
                </Link>
              </div>
            </div>
          </LoadingContainer>
        </div>
      </div>
    </>
  );
};

const checkboxStyle: CSSProperties = {
  transform: 'scale(1.5)',
};
