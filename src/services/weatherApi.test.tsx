import { getCoordinates, fetchWeather } from "./weatherApi"

describe("getCoordinates", () => {
  it("throws if city name is too short", async () => {
    await expect(getCoordinates("a")).rejects.toThrow(
      "Enter a valid city name (at least 2 letters)"
    )
  })

  it("throws if city name has no letters", async () => {
    await expect(getCoordinates("123")).rejects.toThrow(
      "Enter a valid city name (at least 2 letters)"
    )
  })

  it("throws if city is not found", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as any)

    await expect(getCoordinates("asdsgjasgjsaökgl123xyz")).rejects.toThrow(
      "No results found"
    )
  })

  it("returns coordinates for a valid city", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ latitude: 59.437, longitude: 24.7536, name: "Tallinn" }],
      }),
    } as any)

    const result = await getCoordinates("Tallinn")
    expect(result).toEqual({ latitude: 59.437, longitude: 24.7536, name: "Tallinn" })
  })
})

describe("fetchWeather", () => {
  it("throws for out-of-range latitude", async () => {
    await expect(fetchWeather(999, 24)).rejects.toThrow(
      "Invalid coordinates"
    )
  })

  it("throws for out-of-range longitude", async () => {
    await expect(fetchWeather(59, 999)).rejects.toThrow(
      "Invalid coordinates"
    )
  })
})