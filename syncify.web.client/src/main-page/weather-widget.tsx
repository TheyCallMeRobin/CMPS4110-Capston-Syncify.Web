import React, { useState } from 'react';
import ReactWeather, { useVisualCrossing } from 'react-open-weather';
import { cardStyle } from './MainPage.tsx';
import { CSSProperties } from 'react';
import { FaCloud } from 'react-icons/fa';

export const WeatherWidget = () => {
    const cities = [
        { name: 'Baton Rouge, LA', lat: '30.4515', lon: '-91.1871' },
        { name: 'Covington, LA', lat: '30.4755', lon: '-90.1009' },
        { name: 'Denham Springs, LA', lat: '30.4860', lon: '-90.9568' },
        { name: 'Hammond, LA', lat: '30.5044', lon: '-90.4612' },
        { name: 'Lafayette, LA', lat: '30.2241', lon: '-92.0198' },
        { name: 'New Orleans, LA', lat: '29.9511', lon: '-90.0715' },
        { name: 'Shreveport, LA', lat: '32.5252', lon: '-93.7502' },
    ];

    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const { data, isLoading, errorMessage } = useVisualCrossing({
        key: 'XNL226UQKL9BVRUWVWFZAGPWE',
        lat: selectedCity.lat,
        lon: selectedCity.lon,
        lang: 'en',
        unit: 'us',
        options: {currentConditions: true},
    });

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const city = cities.find((c) => c.name === event.target.value);
        if (city) setSelectedCity(city);
    };

    return (
        <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
            <div className={'card-header primary-bg text-white hstack gap-2'}>
                <div>
                    <FaCloud />
                </div>
                <div>Weather</div>
            </div>
            <div className={'card-body'}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="city-select" style={{ marginRight: '0.5rem' }}>
                        Select City:
                    </label>
                    <select
                        id="city-select"
                        value={selectedCity.name}
                        onChange={handleCityChange}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    >
                        {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
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
