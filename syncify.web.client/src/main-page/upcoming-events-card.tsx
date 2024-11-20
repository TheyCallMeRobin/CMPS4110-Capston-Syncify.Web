import React from 'react';
import { useAsync } from 'react-use';
import { useUser } from '../auth/auth-context.tsx';
import { toast } from 'react-toastify';
import './MainPage.css';
import { CalendarEventService } from '../api/generated/CalendarEventService.ts';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { cardStyle } from './MainPage.tsx';
import { FaCalendar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const UpcomingEventsCard: React.FC = () => {
  const user = useUser();

  const fetchUpcomingEvents = useAsync(async () => {
    const response = await CalendarEventService.getUpcomingEventsByUserId({
      userId: user?.id ?? 0,
    });

    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return;
    }
    return response.data?.filter(
      (event) => event.calendarEventType === 'Event'
    );
  }, [user]);

  const EventsDisplay = () => {
    if (!fetchUpcomingEvents.value || fetchUpcomingEvents.value?.length <= 0) {
      return <>There are no upcoming events.</>;
    }

    return (
      <table className={'table table-striped'}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {fetchUpcomingEvents.value?.map((event) => {
            const date = event.startsOn ? (
              new Date(event.startsOn).toLocaleDateString()
            ) : (
              <span>&ndash;&ndash;</span>
            );

            return (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
        <div className={'card-header primary-bg text-white hstack gap-2'}>
          <div>
            <FaCalendar />
          </div>
          <div>Upcoming Events</div>
        </div>
        <div className={'card-body'}>
          <LoadingContainer loading={fetchUpcomingEvents.loading}>
            <div className={'vstack gap-3'}>
              <div>
                <EventsDisplay />
              </div>
              <div>
                <Link to="/calendars" className={'btn btn-primary'}>
                  View All Events
                </Link>
              </div>
            </div>
          </LoadingContainer>
        </div>
      </div>
    </>
  );
};
