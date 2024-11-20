import ReactWeather, { useVisualCrossing } from 'react-open-weather';
import { useGeolocation } from 'react-use';
import { cardStyle } from './MainPage.tsx';
import { CSSProperties } from 'react';
import { FaCloud } from 'react-icons/fa';

export const WeatherWidget = () => {
  const location = useGeolocation();

  const { data, isLoading, errorMessage } = useVisualCrossing({
    key: 'XNL226UQKL9BVRUWVWFZAGPWE',
    lat: `${location.latitude}`,
    lon: `${location.longitude}`,
    lang: 'en',
    unit: 'us',
  });

  return (
    <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
      <div className={'card-header primary-bg text-white hstack gap-2'}>
        <div>
          <FaCloud />
        </div>
        <div>Weather</div>
      </div>
      <div className={'card-body'}>
        <ReactWeather
          style={weatherStyle}
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          unitsLabels={{ temperature: 'F', windSpeed: 'm/h' }}
          showForecast={false}
        />
      </div>
    </div>
  );
};

const weatherStyle: CSSProperties = {
  maxHeight: '300px',
};
