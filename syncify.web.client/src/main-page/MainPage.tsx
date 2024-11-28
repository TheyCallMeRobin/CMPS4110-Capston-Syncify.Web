import React from 'react';
import { UpcomingEventsCard } from './upcoming-events-card.tsx';
import { TodaysTodos } from './todays-todos.tsx';
import { RecipeOfTheDay } from './recipe-of-the-day.tsx';
import { FamilyMembers } from './family-members.tsx';
import { QuickActions } from './quick-actions.tsx';
import { WeatherWidget } from './weather/weather-widget.tsx';

export const MainPage: React.FC = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className={'col-12'}>
            <h2 className={'text-center text-highlight'}>Dashboard</h2>
          </div>
        </div>
      </div>
      <div className={'row'}>
        <div className={'col-lg-4 col-md-6'}>
          <WeatherWidget />
        </div>
        <div className={'col-lg-4 col-md-6'}>
          <UpcomingEventsCard />
        </div>
        <div className={'col-lg-4 col-md-6'}>
          <TodaysTodos />
        </div>
        <div className={'col-lg-4 col-md-6'}>
          <RecipeOfTheDay />
        </div>
        <div className={'col-lg-4 col-md-6'}>
          <FamilyMembers />
        </div>
        <div className={'col-lg-4 col-md-6'}>
          <QuickActions />
        </div>
      </div>
    </>
  );
};

export const cardStyle = {
  width: '100%',
  height: 'auto',
};
