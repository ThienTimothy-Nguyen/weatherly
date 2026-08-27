import axios from "axios";
import http from "http";
import url from "url";
import { it, describe, expect, vi } from "vitest";
import { buildDailyForecast, buildWeatherResponse, sendJSON } from "..";

const API_key = process.env.API_key;
const PORT = 3000;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

describe("sendJSON", () => {
  it("should send JSON string with correct status, headers, and data", () => {
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    };

    sendJSON(res, 400, { error: "City is required" });

    expect(res.writeHead).toHaveBeenCalledWith(400, expect.objectContaining({"Content-Type" : "application/json"}));

    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: "City is required" }));
  });
});

describe("buildDailyForecast", () => {
  it("should return a list of date object with weather entries", () => {
    const list = [
      {
        "main": {
          "temp": 14.25,
        },
        "weather": [
          {
            "description": "broken clouds",
            "icon": "04n"
          }
        ],
        "dt_txt": "2026-08-23 12:00:00"
      },
      {
        "main": {
          "temp": 16.80,
        },
        "weather": [
          {
            "description": "scattered clouds",
            "icon": "03n"
          }
        ],
        "dt_txt": "2026-08-23 18:00:00"
      },
      {
        "main": {
          "temp": 296.76,
        },
        "weather": [
          {
            "description": "light rain",
            "icon": "10d"
          }
        ],
        "dt_txt": "2026-08-31 18:00:00"
      },
      {
        "main": {
          "temp": 294.50,
        },
        "weather": [
          {
            "description": "moderate rain",
            "icon": "10n"
          }
        ],
        "dt_txt": "2026-08-31 21:00:00"
      }
    ];

    expect(buildDailyForecast(list)).toHaveLength(2);

    buildDailyForecast(list).forEach((dateEntry) => {
      const hourEntries = list.filter(entry => entry.dt_txt.split(" ")[0] === dateEntry.date);
      const mid = hourEntries[Math.floor(hourEntries.length / 2)];

      expect(dateEntry).toEqual({
        date: dateEntry.date,
        tempMin: Math.min(...hourEntries.map(entry => entry.main.temp)),
        tempMax: Math.max(...hourEntries.map(entry => entry.main.temp)),
        description: mid.weather[0].description,
        icon: mid.weather[0].icon,
      });
    });
  });

  it("should return maximum 5 date entries", () => {
    const list = [
      {
        main: { temp: 14.25 },
        weather: [
          {
            description: "broken clouds",
            icon: "04n"
          }
        ],
        dt_txt: "2026-08-23 21:00:00"
      },
      {
        main: { temp: 16.8 },
        weather: [
          {
            description: "scattered clouds",
            icon: "03n"
          }
        ],
        dt_txt: "2026-08-24 18:00:00"
      },
      {
        main: { temp: 18.4 },
        weather: [
          {
            description: "clear sky",
            icon: "01d"
          }
        ],
        dt_txt: "2026-08-25 15:00:00"
      },
      {
        main: { temp: 17.1 },
        weather: [
          {
            description: "light rain",
            icon: "10d"
          }
        ],
        dt_txt: "2026-08-26 12:00:00"
      },
      {
        main: { temp: 15.6 },
        weather: [
          {
            description: "overcast clouds",
            icon: "04d"
          }
        ],
        dt_txt: "2026-08-27 09:00:00"
      },
      {
        main: { temp: 19.2 },
        weather: [
          {
            description: "few clouds",
            icon: "02d"
          }
        ],
        dt_txt: "2026-08-28 06:00:00"
      }
    ];

    expect(buildDailyForecast(list)).toHaveLength(5);
  })
});

describe("buildWeatherResponse", () => {
  const current = {
    name: "Saigon",
    sys: { country: "Vietnam" },
    main: {
      temp: 75,
      feels_like: 80,
      humidity: 25,
    },
    weather: [
      {
        description: "Best place to visit...",
        icon: "04n"
      },
    ],
    wind: {
      speed: 25,
    }
  }

  const forecast = {
    list: [
      {
        "main": {
          "temp": 14.25,
        },
        "weather": [
          {
            "description": "broken clouds",
            "icon": "04n"
          }
        ],
        "dt_txt": "2026-08-23 12:00:00"
      },
      {
        "main": {
          "temp": 16.80,
        },
        "weather": [
          {
            "description": "scattered clouds",
            "icon": "03n"
          }
        ],
        "dt_txt": "2026-08-23 18:00:00"
      },
      {
        "main": {
          "temp": 296.76,
        },
        "weather": [
          {
            "description": "light rain",
            "icon": "10d"
          }
        ],
        "dt_txt": "2026-08-31 18:00:00"
      },
      {
        "main": {
          "temp": 294.50,
        },
        "weather": [
          {
            "description": "moderate rain",
            "icon": "10n"
          }
        ],
        "dt_txt": "2026-08-31 21:00:00"
      }
    ]
  };

  it("should return a normalized data in the appropriate format.", () => {
    expect(buildWeatherResponse(current, forecast)).toEqual({
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
      forecast: expect.arrayContaining([
        {
          date: "2026-08-23",
          tempMin: 14.25,
          tempMax: 16.8,
          description: "scattered clouds",
          icon: "03n"
        },
        {
          date: "2026-08-31",
          tempMin: 294.5,
          tempMax: 296.76,
          description: "moderate rain",
          icon: "10n"
        }
      ]),
    })
  });
})