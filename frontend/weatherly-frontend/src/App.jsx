import { useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getWeather() {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const res = await fetch(`http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.err || "Request failed");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      padding: 20, 
      fontFamily: "sans-serif",
    }}>
      <h1>Weatherly</h1>
      <input 
        type="text"
        placeholder="Enter city (e.g. London"
        value={city}
        onChange={(e) => setCity(e.target.value)} />
      <button 
        style={{
          marginLeft: 8,
        }}
        onClick={getWeather}>
        Get weather
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && 
        <div style={{ marginTop: 20 }}>
          <h2>
            {weather.location.name}, {weather.location.country}
          </h2>

          <p>
            {weather.current.temp} - {weather.current.description}
          </p>

          <p>Feels like: {weather.current.feels_like}</p>
          <p>Humidity: {weather.current.humidity}</p>
          <p>Wind: {weather.current.windSpeed}</p>

          <h3>5-day Forecast</h3>
          <ul>
            {weather.forecast.map(day => (
              <li key={day.date}>
                {day.date}: {day.temperature} / {day.tempMax} - {day.description}
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  )
}
