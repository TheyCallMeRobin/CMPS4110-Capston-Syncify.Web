import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import { UpcomingEventsCard } from './upcoming-events-card.tsx';
import { TodaysTodos } from './todays-todos.tsx';
import { RecipeOfTheDay } from './recipe-of-the-day.tsx';
import { FamilyMembers } from './family-members.tsx';
import { QuickActions } from './quick-actions.tsx';
import { WeatherWidget } from './weather-widget.tsx';
import 'react-grid-layout/css/styles.css';

export const MainPage: React.FC = () => {
  const defaultLayout = [
    { i: 'weather', x: 0, y: 0, w: 1, h: 3, isResizable: false },
    { i: 'events', x: 1, y: 0, w: 1, h: 2 },
    { i: 'todos', x: 2, y: 0, w: 1, h: 2 },
    { i: 'recipe', x: 0, y: 2, w: 1, h: 2 },
    { i: 'family', x: 1, y: 2, w: 1, h: 2 },
    { i: 'actions', x: 2, y: 2, w: 1, h: 2 },
  ];

  const [layout, setLayout] = useState(() => {
    const savedLayout = sessionStorage.getItem('mainPageLayout');
    const initialLayout = savedLayout ? JSON.parse(savedLayout) : defaultLayout;
    return initialLayout;
  });

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    sessionStorage.setItem('mainPageLayout', JSON.stringify(newLayout));
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="row">
        <div className={'col-12'}>
          <h2 className={'text-center text-highlight'}>Dashboard</h2>
        </div>
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={3}
        rowHeight={175}
        width={window.innerWidth * 0.92}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".card-header"
        bounds="parent"
      >
        <div key="weather" className="card">
          <WeatherWidget />
        </div>
        <div key="events" className="card">
          <UpcomingEventsCard />
        </div>
        <div key="todos" className="card">
          <TodaysTodos />
        </div>
        <div key="recipe" className="card">
          <RecipeOfTheDay />
        </div>
        <div key="family" className="card">
          <FamilyMembers />
        </div>
        <div key="actions" className="card">
          <QuickActions />
        </div>
      </GridLayout>
    </div>
  );
};

export const cardStyle = {
  minWidth: '180px',
  minHeight: '150px',
};
