import http from "http";
import axios from "axios";
import dotenv from "dotenv";
import url from "url";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT = 3000;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type" : "application/json",
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "GET, OPTIONS",
    "Access-Control-Allow-Headers" : "Content-Type"
  });
  res.end(JSON.stringify(data));
}

export function buildDailyForecast(list) {
  const byDate = {};

  list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    if (!byDate[date]) byDate[date] = [];

    byDate[date].push(entry);
  })

  return Object.keys(byDate).slice(0,5).map(date => {
    const items = byDate[date];
    const mid = items[Math.floor(items.length / 2)];

    return {
      date,
      tempMin: Math.min(...items.map(i => i.main.temp)),
      tempMax: Math.max(...items.map(i => i.main.temp)),
      description: mid.weather[0].description,
      icon: mid.weather[0].icon
    }
  })
}

export function buildWeatherResponse(current, forecast) {
  return {
    location: {
      name: current.name,
      country: current.sys.country,
    }, 
    current: {
      temp: current.main.temp,
      feels_like: current.main.feels_like,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
    },
    forecast: buildDailyForecast(forecast.list),
  };
};

const server = http.createServer(async (req, res) => {
  if(req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Methods" : "GET, OPTIONS",
      "Access-Control-Allow-Headers" : "Content-Type"
    });

    return res.end();
  };

  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  const query = parsed.query;

  if(path === "/api/weather") {
    const city = query.city;
    const units = query.units || "metrics";

    if (!city) {
      return sendJSON(res, 400, { error: "City is required" });
    };

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`
        ),
        axios.get(
          `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`
        ),
      ]);

      const data = buildWeatherResponse(currentRes.data, forecastRes.data);
      return sendJSON(res, 200, data);
    } catch (err) {
      console.error("Weather city error:", err.response?.data);
      return sendJSON(res, 500, {error: "Weather lookup failed"});
    };
  }
  if (path === "/api/weather/coords") {
    const {lat, lon, units = "metrics"} = query;
    if (!lat || !lon) {
      return sendJSON(res, 400, {error: "lat and lon required"})
    }

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
        ),
        axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`)
      ]);

      const data = buildWeatherResponse(currentRes.data, forecastRes.data);
      return sendJSON(res, 200, data)
    } catch (err) {
        console.error("Weather coords error:", err.response?.data);
        return sendJSON(res, 500, { error: "Weather lookup failed" });
    }
  }
  sendJSON(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`weather server running at http://localhost:${PORT}`)
})