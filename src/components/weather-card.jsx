import { getWeatherDetails } from '../utils/weather';
import './weather-card.css';

export function WeatherCard({ 
  date, 
  maxTemp, 
  minTemp, 
  precipitationProbability, 
  windSpeedMean, 
  surfacePressureMean, 
  windGustsMean, 
  uvIndexMax,
  weatherCode 
}) {
  const { emoji, description } = getWeatherDetails(weatherCode);

  return (
    <div className="weather-card">
      <h3>{date}</h3>
      <div className="weather-card-icon">{emoji}</div>
      <p className="weather-card-desc">{description}</p>
      <div className="weather-card-temps">
        <span className="weather-card-max">Max: {maxTemp}°C</span> / <span className="weather-card-min">Min: {minTemp}°C</span>
      </div>
      <hr className="weather-card-divider" />
      <div className="weather-card-details">
        <p>Precipitation probability: <strong>{precipitationProbability}%</strong></p>
        <p>Wind speed: <strong>{windSpeedMean} m/s</strong></p>
        <p>Wind gusts: <strong>{windGustsMean} m/s</strong></p>
        <p>Pressure: <strong>{surfacePressureMean} hPa</strong></p>
        <p>UV-index (max): <strong>{uvIndexMax}</strong></p>
      </div>
    </div>
  );
}