export function getWeatherDetails(code) {
  switch (code) {
    case 0:
      return { emoji: '☀️', description: 'Clear sky' };
    case 1:
    case 2:
      return { emoji: '⛅', description: 'Partly cloudy' };
    case 3:
      return { emoji: '☁️', description: 'Overcast' };
    case 45:
    case 48:
      return { emoji: '🌫️', description: 'Fog' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { emoji: '🌦️', description: 'Drizzle' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return { emoji: '🌧️', description: 'Rain' };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { emoji: '❄️', description: 'Snow' };
    case 95:
    case 96:
    case 97:
    case 99:
      return { emoji: '⛈️', description: 'Thunderstorm' };
    default:
      return { emoji: '🌡️', description: 'Unknown' };
  }
}

export const Location = { latitude: 50.4547, longitude: 30.5238, name: 'Kyiv' };