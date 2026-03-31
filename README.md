# Weather App

A simple weather app built with React and TypeScript, using the [Open-Meteo](https://open-meteo.com/) API.

## Getting started

Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/eriktarelkin/ut-proovitoo-et.git
cd proovitoo
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Start the tests:

```bash
npm test
```

The app runs at `http://localhost:3000`.

## What was done

**Adding locations** — locations can be added either by city name or by entering coordinates manually with a custom label (e.g. "Home, Office").

**Weather data** — fetches current temperature, wind speed, and precipitation for each location. Data refreshes automatically on page load using stored coordinates.

**Persistent storage** — since i didn't have BE support: added cards are saved to localStorage so they survive page refreshes. Thought of using Redux crossed my mind, but because the scale of this app is small, i decided not to use it.

**Card editing** — each card can be edited. The name and coordinates can be changed, and there is a helper button to generate coordinates from a city name.

**Input validation** — coordinates are validated against allowed ranges before hitting the API. City names are checked for minimum length and matched against a regex pattern. API error messages are surfaced directly to the user.

**Component structure** — shared `Button` component with variants (primary, secondary, danger, icon) and a `Card` component that handles display and editing of each location. Styles are split per component with plain CSS.