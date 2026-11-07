import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { WeatherCard } from '../components/weather-card';
import { getWeatherDetails, Location } from '../utils/weather';
import { fetchWeatherApi } from "openmeteo";
import './dashboard.css';

export function Dashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState(Location.name);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('isAuthenticated');
    Cookies.remove('username');
    navigate('/login');
  };


  const loadWeatherData = async (latitude = Location.latitude, longitude = Location.longitude, name = Location.name) => {
    setLoading(true);
    try {
      const params = {
        latitude,
        longitude,
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_probability_mean",
          "wind_speed_10m_mean",
          "surface_pressure_mean",
          "wind_gusts_10m_mean",
          "uv_index_max"
        ],
        current: [
          "is_day",
          "apparent_temperature",
          "wind_direction_10m",
          "wind_speed_10m",
          "precipitation",
          "temperature_2m",
          "surface_pressure",
          "weather_code"
        ],
        wind_speed_unit: "ms"
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();

      const current = response.current();
      const daily = response.daily();

      const parsedData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          is_day: current.variables(0).value(),
          apparent_temperature: current.variables(1).value(),
          wind_direction_10m: current.variables(2).value(),
          wind_speed_10m: current.variables(3).value(),
          precipitation: current.variables(4).value(),
          temperature_2m: current.variables(5).value(),
          surface_pressure: current.variables(6).value(),
          weather_code: current.variables(7).value(),
        },
        daily: {
          time: Array.from(
            { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
            (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
          ),
          weather_code: daily.variables(0).valuesArray(),
          temperature_2m_max: daily.variables(1).valuesArray(),
          temperature_2m_min: daily.variables(2).valuesArray(),
          precipitation_probability_mean: daily.variables(3).valuesArray(),
          wind_speed_10m_mean: daily.variables(4).valuesArray(),
          surface_pressure_mean: daily.variables(5).valuesArray(),
          wind_gusts_10m_mean: daily.variables(6).valuesArray(),
          uv_index_max: daily.variables(7).valuesArray(),
        },
      };

      setWeatherData(parsedData);
      setLocationName(name);
    } catch (err) {
      console.error("Weather load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeatherData(position.coords.latitude, position.coords.longitude, 'Your location');
        },
        () => {
          loadWeatherData(Location.latitude, Location.longitude, Location.name);
        }
      );
    } else {
      loadWeatherData(Location.latitude, Location.longitude, Location.name);
    }
  }, []);

  const currentDetails = weatherData?.current ? getWeatherDetails(weatherData.current.weather_code) : null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Weather</h1>
        <button onClick={handleLogout} className="dashboard-logout-btn">Exit</button>
        <p className ="dashboard-city-title">{locationName}</p>
      </header>

      {loading ? (
        <div className="dashboard-loader">Loading weather data...</div>
      ) : (
        <div>
          {weatherData?.current && (
            <div className="dashboard-current-card">
              <h2 className="dashboard-title">Current weather {currentDetails?.emoji} ({currentDetails?.description})</h2>
              <div className="dashboard-current-grid">
                <p>🌡️ Temperature: <strong>{weatherData.current.temperature_2m.toFixed(1)}°C</strong></p>
                <p>🌡️ Feels like: <strong>{weatherData.current.apparent_temperature.toFixed(1)}°C</strong></p>
                <p>🕒 Daytime: <strong>{weatherData.current.is_day ? 'Day ☀️' : 'Night 🌙'}</strong></p>
                <p>🌧️ Precipitation: <strong>{weatherData.current.precipitation.toFixed(1)} mm</strong></p>
                <p>💨 Wind speed: <strong>{weatherData.current.wind_speed_10m.toFixed(1)} m/s</strong></p>
                <p>🧭 Wind direction: <strong>{weatherData.current.wind_direction_10m.toFixed(1)}°</strong></p>
                <p>🔵 Surface pressure: <strong>{weatherData.current.surface_pressure.toFixed(1)} hPa</strong></p>
              </div>
            </div>
          )}

          <h2 className="dashboard-title">7 day forecast</h2>
          <div className="dashboard-weather-grid">
            {weatherData?.daily.time.map((time, index) => (
              <WeatherCard
                key={index}
                date={time.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                maxTemp={weatherData.daily.temperature_2m_max[index].toFixed(1)}
                minTemp={weatherData.daily.temperature_2m_min[index].toFixed(1)}
                precipitationProbability={Math.round(weatherData.daily.precipitation_probability_mean[index])}
                windSpeedMean={weatherData.daily.wind_speed_10m_mean[index].toFixed(1)}
                surfacePressureMean={weatherData.daily.surface_pressure_mean[index].toFixed(1)}
                windGustsMean={weatherData.daily.wind_gusts_10m_mean[index].toFixed(1)}
                uvIndexMax={weatherData.daily.uv_index_max[index].toFixed(1)}
                weatherCode={weatherData.daily.weather_code[index]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}