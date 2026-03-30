import { useState } from "react"
import { WeatherData } from "../../types"
import { CardUpdate } from "../../hooks/useWeather"
import { getCoordinates } from "../../services/weatherApi"
import { Button } from "../Button/Button"
import "./Card.css"

type Props = Omit<WeatherData, "id"> & {
  onDelete: () => void
  onEdit: (update: CardUpdate) => void
}

export const Card = ({
  location,
  latitude,
  longitude,
  temperature,
  windSpeed,
  rain,
  updatedAt,
  onDelete,
  onEdit,
}: Props) => {
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(location ?? "")
  const [latInput, setLatInput] = useState(latitude != null ? String(latitude) : "")
  const [lonInput, setLonInput] = useState(longitude != null ? String(longitude) : "")
  const [resolving, setResolving] = useState(false)
  const [coordsError, setCoordsError] = useState<string | null>(null)

  const handleGenerateCoords = async () => {
    if (!nameInput.trim()) {
      setCoordsError("Enter a name first")
      return
    }
    setResolving(true)
    setCoordsError(null)
    try {
      const { latitude: lat, longitude: lon } = await getCoordinates(nameInput.trim())
      setLatInput(String(lat))
      setLonInput(String(lon))
    } catch (err) {
      setCoordsError(err instanceof Error ? err.message : "Failed to get coordinates")
    } finally {
      setResolving(false)
    }
  }

  const handleSave = () => {
    const lat = parseFloat(latInput)
    const lon = parseFloat(lonInput)
    if (!nameInput.trim() || isNaN(lat) || isNaN(lon)) return
    onEdit({ location: nameInput.trim(), latitude: lat, longitude: lon })
    setEditing(false)
  }

  const handleCancel = () => {
    setNameInput(location ?? "")
    setLatInput(latitude != null ? String(latitude) : "")
    setLonInput(longitude != null ? String(longitude) : "")
    setCoordsError(null)
    setEditing(false)
  }

  const lastUpdated = new Date(updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <article className="card">
      {editing ? (
        <div className="card-edit">
          <label>Name</label>
          <div className="card-edit-row">
            <input
              className="card-edit-input"
              value={nameInput}
              onChange={(e) => { 
                setNameInput(e.target.value) 
                setCoordsError(null) 
              }}
              onKeyDown={(e) => e.key === "Escape" && handleCancel()}
              placeholder="e.g. Home, Office..."
              autoFocus
            />
            <Button
              variant="icon"
              label={resolving ? "..." : "→ coords"}
              onClick={handleGenerateCoords}
              disabled={resolving}
              tooltip="Generate coordinates from name"
            />
          </div>
          {coordsError && <p className="resolve-error">{coordsError}</p>}

          <label>Coordinates</label>
          <div className="card-edit-row">
            <input
              className="card-edit-input"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && handleCancel()}
              placeholder="Latitude"
            />
            <input
              className="card-edit-input"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") handleCancel()
              }}
              placeholder="Longitude"
            />
          </div>

          <div className="card-edit-actions">
            <Button variant="primary" label="Save" onClick={handleSave} />
            <Button variant="secondary" label="Cancel" onClick={handleCancel} />
          </div>
        </div>
      ) : (
        <div className="card-title-row">
          <h2>{location}</h2>
          <Button variant="secondary" label="Edit" onClick={() => setEditing(true)} />
        </div>
      )}

      <p className="card-coords">{latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
      <p>Temperature: {temperature}°C</p>
      <p>Wind Speed: {windSpeed} m/s</p>
      <p>Rain: {rain} mm</p>
      <p className="updated-at">Updated: {lastUpdated}</p>

      <Button variant="danger" label="Delete" onClick={onDelete} />
    </article>
  )
}