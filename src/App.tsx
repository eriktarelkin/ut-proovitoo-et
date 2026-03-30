import { useState } from "react"
import { useWeather, loadCards } from "./hooks/useWeather"
import { WeatherData } from "./types"
import { Card } from "./components/Card/Card"
import { Button } from "./components/Button/Button"
import "./App.css"

type AddMode = "city" | "coords"

export const App = () => {
  const { cards, loading, updatingId, initializing, error, addByCity, addByCoords, updateCard, deleteLocation } = useWeather()

  const [mode, setMode] = useState<AddMode>("city")
  const [cityInput, setCityInput] = useState("")
  const [labelInput, setLabelInput] = useState("")
  const [latInput, setLatInput] = useState("")
  const [lonInput, setLonInput] = useState("")

  const handleAddByCity = () => {
    if (!cityInput.trim()) return
    addByCity(cityInput.trim())
    setCityInput("")
  }

  const handleAddByCoords = () => {
    const lat = parseFloat(latInput)
    const lon = parseFloat(lonInput)
    if (!labelInput.trim() || isNaN(lat) || isNaN(lon)) return
    addByCoords(labelInput.trim(), lat, lon)
    setLabelInput("")
    setLatInput("")
    setLonInput("")
  }

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="mode-toggle">
        <Button
          variant="secondary"
          label="By city"
          active={mode === "city"}
          onClick={() => setMode("city")}
        />
        <Button
          variant="secondary"
          label="By coordinates"
          active={mode === "coords"}
          onClick={() => setMode("coords")}
        />
      </div>

      {mode === "city" ? (
        <div className="search-row">
          <input
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddByCity()}
            placeholder="Enter city name"
          />
          <Button label={loading ? "Adding..." : "Add"} onClick={handleAddByCity} disabled={loading} />
        </div>
      ) : (
        <div className="coords-form">
          <div className="coords-row">
            <input
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="Latitude"
            />
            <input
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              placeholder="Longitude"
            />
          </div>
          <input
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddByCoords()}
            placeholder="Label (e.g. Home, Office)"
          />
          <Button label={loading ? "Adding..." : "Add"} onClick={handleAddByCoords} disabled={loading} />
        </div>
      )}

      {error && <p className="status error">{error}</p>}

      {!loading && !initializing && cards.length === 0 && (
        <p className="status">Add a city to get started</p>
      )}

      <div className="cards">
        {initializing
          ? loadCards().map((card: WeatherData, i: number) => (
              <Card
                key={i}
                loading={updatingId === card.id}
                location={card.location}
                latitude={card.latitude}
                longitude={card.longitude}
                temperature={card.temperature}
                windSpeed={card.windSpeed}
                rain={card.rain}
                updatedAt={card.updatedAt}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            ))
          : cards.map((card) => (
              <Card
                key={card.id}
                location={card.location}
                latitude={card.latitude}
                longitude={card.longitude}
                temperature={card.temperature}
                windSpeed={card.windSpeed}
                rain={card.rain}
                updatedAt={card.updatedAt}
                onDelete={() => deleteLocation(card.id)}
                onEdit={(update) => updateCard(card.id, update)}
              />
            ))}
        {loading && !updatingId && (
          <Card
            loading
            location=""
            latitude={0}
            longitude={0}
            temperature={0}
            windSpeed={0}
            rain={0}
            updatedAt={0}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        )}
      </div>
    </div>
  )
}