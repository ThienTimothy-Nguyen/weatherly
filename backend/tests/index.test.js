import axios from "axios";
import http from "http";
import url from "url";
import dotenv from "dotenv";
import { it, describe, expect, vi } from "vitest";
import { buildDailyForecast, sendJSON } from "..";

dotenv.config();

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
    buildDailyForecast(list).forEach((item, i) => {
      expect(item).toEqual(
        expect.objectContaining({
          date: list[i].dt_txt.split(" ")[0],
          tempMin: Math.min(...list.map(entry => entry.main.temp)),
          tempMax: Math.max(...list.map(entry => entry.main.temp)),
          description: list[i].weather.description,
        })
      );
    })
  })
});