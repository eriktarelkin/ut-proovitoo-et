import { useState } from "react"
import { WeatherData } from "../../types"
import { CardUpdate } from "../../hooks/useWeather"
import { getCoordinates } from "../../services/weatherApi"
import { Button } from "../Button/Button"
import { Skeleton, SkeletonGroup } from "../Skeleton/Skeleton"
import "./Card.css"

type Props = Omit<WeatherData, "id"> & {
  loading?: boolean
  onDelete: () => void
  onEdit: (update: CardUpdate) => void
}

export const Card = ({
  loading = false,
  location,
  latitude,
  longitude,
  temperature,
  windSpeed,
  windDirection,
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

  const lastUpdated = new Date(updatedAt).toLocaleTimeString('it-IT', {
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
              label={resolving ? "..." : "Get coordinates"}
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
        <div className="card-header">
          <div 
            className={
              `card-temperature ${temperature >= 0 
              ? "card-temperature--warm" 
              : "card-temperature--cold"}`
              }>
            {loading
              ? <Skeleton shape="text" width="56px" style={{ fontSize: "3rem" }} />
              : `${temperature}°`}
          </div>

          <div className="card-info">
            <div className="card-title-row">
              <h2>
                {loading
                  ? <Skeleton shape="text" width="55%" style={{ fontSize: "1.15rem" }} />
                  : location}
              </h2>
              <div className="buttons">
                {!loading && (
                  <Button variant="secondary" label="Edit" onClick={() => setEditing(true)} />
                )}
              </div>
            </div>

            {loading ? (
              <SkeletonGroup gap="6px">
                <Skeleton shape="text" width="75%" />
                <Skeleton shape="text" width="60%" />
                <Skeleton shape="text" width="50%" />
              </SkeletonGroup>
            ) : (
              <div className="card-stats">
                <div className="card-stat">
                  <span className="stat-label">Coordinates</span>
                  <span className="stat-value">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                </div>
                <div className="card-stat">
                  <span className="stat-label">Wind</span>
                  <span className="stat-value">{windSpeed} m/s</span>
                  <span
                      className="wind-arrow"
                      style={{ transform: `rotate(${windDirection}deg)` }}
                    >↑</span>
                </div>
                <div className="card-stat">
                  <span className="stat-label">Rain</span>
                  <span className="stat-value">{rain} mm</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card-footer">
        {loading
          ? <Skeleton width="72px" height="34px" shape="rounded" />
          : <Button variant="danger" label="Delete" onClick={onDelete} />}
        <span className="updated-at">
          {loading
            ? <Skeleton shape="text" width="80px" style={{ fontSize: "0.75rem" }} />
            : `Updated: ${lastUpdated}`}
        </span>
      </div>
    </article>
  )
}