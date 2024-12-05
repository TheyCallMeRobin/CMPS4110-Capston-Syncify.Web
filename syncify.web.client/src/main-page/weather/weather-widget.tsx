import React, { useMemo } from 'react';
import { cardStyle } from '../MainPage.tsx';
import { FaCloud } from 'react-icons/fa';
import { WeatherDisplay } from './weather-display.tsx';
import { useAsync } from 'react-use';
import { LoadingContainer } from '../../Components/loading-container.tsx';

async function isOnline(): Promise<boolean> {
  try {
    if (!navigator.onLine) {
      return false;
    }
    const exampleComUrl = 'https://httpbin.org/';
    const url = new URL(exampleComUrl);

    const originResponse = await fetch(url, {
      method: 'GET',
    });

    return originResponse.ok || originResponse.status >= 200;
  } catch {
    return false;
  }
}

export const WeatherWidget = () => {
  const fetchOnlineStatus = useAsync(async () => {
    return await isOnline();
  }, []);

  const online = useMemo(
    () => fetchOnlineStatus.value,
    [fetchOnlineStatus.value]
  );

  return (
    <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
      <div className={'card-header primary-bg text-white hstack gap-2'}>
        <div>
          <FaCloud />
        </div>
        <div>Weather</div>
      </div>
      <div className={'card-body'}>
        <LoadingContainer loading={fetchOnlineStatus.loading}>
          {online ? (
            <WeatherDisplay />
          ) : (
            <p className={'fst-italic'}>
              An internet connection is required to display the weather.
            </p>
          )}
        </LoadingContainer>
      </div>
    </div>
  );
};
