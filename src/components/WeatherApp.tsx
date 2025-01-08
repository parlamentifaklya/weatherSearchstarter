import React, { useEffect, useState } from 'react';
import { Weather } from './WeatherType';
import '../app.css';

const WeatherApp: React.FC = () => {
  const [data, setData] = useState<Weather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityId, setCityId] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<Weather | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Weather.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData);

        if (jsonData.weather && Array.isArray(jsonData.weather)) {
          setData(jsonData.weather);
        } else {
          throw new Error('Fetched data is not in the expected format');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Fetch error:', err.message);
          setError(err.message);
        } else {
          console.error('An unknown error occurred');
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityId(event.target.value);
  };

  const findCityWeather = () => {
    const cityWeather = data.find(item => item.id === parseInt(cityId));
    setSelectedCity(cityWeather || null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='container'>
      <h1>Weather App</h1>
      <div className='search-section'>
        <input
            type="text"
            value={cityId}
            onChange={handleInputChange}
            placeholder="Enter city ID"
        />
        <button onClick={findCityWeather}>Get Weather</button>
      </div>

      {selectedCity ? (
        <div className='result-container'>
          <h2>{selectedCity.cityName}</h2>
          <img src={selectedCity.icon} alt={selectedCity.weather} />
          <p>Temperature: {selectedCity.temperature}°C</p>
          <p>Weather: {selectedCity.weather}</p>
        </div>
      ) : (
        <div>No city selected or city not found.</div>
      )}
    </div>
  );
};

export default WeatherApp;