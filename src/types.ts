export type WeatherData = {
  id: number
  location: string
  latitude: number
  longitude: number
  temperature: number
  windSpeed: number
  rain: number
  updatedAt: number
}

export type WeatherResponse = {
  current: {
    temperature_2m: number
    wind_speed_10m: number
    precipitation: number
  }
}