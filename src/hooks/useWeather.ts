import { useState, useEffect } from "react"
import { fetchWeather, getCoordinates } from "../services/weatherApi"
import { WeatherData } from "../types"

const STORAGE_KEY = "weather_cards"

export const loadCards = (): WeatherData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveCards = (cards: WeatherData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export type CardUpdate = {
  location: string
  latitude: number
  longitude: number
}

export const useWeather = () => {
  const [cards, setCards] = useState<WeatherData[]>(loadCards)
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [initializing, setInitializing] = useState(() => loadCards().length > 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const refreshAll = async () => {
      const stored = loadCards()
      if (stored.length === 0) return

      const refreshed = await Promise.all(
        stored.map(async (card) => {
          try {
            const data = await fetchWeather(card.latitude, card.longitude)
            return {
              ...card,
              temperature: data.current.temperature_2m,
              windSpeed: data.current.wind_speed_10m,
              windDirection: data.current.wind_direction_10m,
              rain: data.current.precipitation,
              updatedAt: Date.now(),
            }
          } catch {
            return card
          }
        })
      )

      setCards(refreshed)
      setInitializing(false)
    }

    refreshAll().catch(() => setInitializing(false))
  }, [])

  useEffect(() => {
    saveCards(cards)
  }, [cards])

  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 4000)
    return () => clearTimeout(timer)
  }, [error])

  const addByCity = async (city: string) => {
    try {
      setLoading(true)
      setError(null)

      const { latitude, longitude, name } = await getCoordinates(city)
      const data = await fetchWeather(latitude, longitude)

      setCards((prev) => [
        ...prev,
        {
          id: Date.now(),
          location: name,
          latitude,
          longitude,
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          rain: data.current.precipitation,
          updatedAt: Date.now(),
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not fetch weather for that city")
    } finally {
      setLoading(false)
    }
  }

  const addByCoords = async (label: string, latitude: number, longitude: number) => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchWeather(latitude, longitude)

      setCards((prev) => [
        ...prev,
        {
          id: Date.now(),
          location: label,
          latitude,
          longitude,
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          rain: data.current.precipitation,
          updatedAt: Date.now(),
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not fetch weather for those coordinates")
    } finally {
      setLoading(false)
    }
  }

  const updateCard = async (id: number, update: CardUpdate) => {
    try {
      setUpdatingId(id)
      setLoading(true)
      setError(null)

      const data = await fetchWeather(update.latitude, update.longitude)

      setCards((prev) =>
        prev.map((c) =>
          c.id !== id
            ? c
            : {
                ...c,
                location: update.location,
                latitude: update.latitude,
                longitude: update.longitude,
                temperature: data.current.temperature_2m,
                windSpeed: data.current.wind_speed_10m,
                rain: data.current.precipitation,
                updatedAt: Date.now(),
              }
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update location")
    } finally {
      setLoading(false)
      setUpdatingId(null) 
    }
  }

  const deleteLocation = (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  return {
    cards,
    loading,
    initializing,
    error,
    updatingId,
    addByCity,
    addByCoords,
    updateCard,
    deleteLocation,
  }
}