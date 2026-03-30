import type { WeatherResponse } from "../types"

const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast"

const WEATHER_PARAMS = [
  "temperature_2m",
  "wind_speed_10m",
  "wind_direction_10m",
  "precipitation",
].join(",")

export type GeoResult = {
  latitude: number
  longitude: number
  name: string
}

const isValidCoords = (lat: number, lon: number) =>
  !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180

const isValidCityName = (city: string) =>
  city.trim().length >= 2 && /[a-zA-ZÀ-ÿ]/.test(city)

export const getCoordinates = async (city: string): Promise<GeoResult> => {
  if (!isValidCityName(city)) {
    throw new Error("Enter a valid city name (at least 2 letters)")
  }

  const params = new URLSearchParams({ name: city })
  const res = await fetch(`${GEO_BASE_URL}?${params}`)

  if (!res.ok) throw new Error(`Geocoding service error (${res.status})`)

  const data = await res.json()

  if (data.error) throw new Error(data.error)

  if (!data.results || data.results.length === 0) {
    throw new Error(`No results found for "${city}"`)
  }

  const { latitude, longitude, name } = data.results[0]
  return { latitude, longitude, name }
}

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  if (!isValidCoords(lat, lon)) {
    throw new Error(
      `Invalid coordinates: latitude must be -90 to 90, longitude -180 to 180`
    )
  }

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: WEATHER_PARAMS,
  })

  const res = await fetch(`${WEATHER_BASE_URL}?${params}`)

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.reason ?? `Weather service error (${res.status})`)
  }

  return res.json()
}