import http from "http";
import axios from "axios";
import dotenv from "dotenv";
import url from "url";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT = 3000;

const BASE_URL = "https://api.openweathermap.org/data/2.5";

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type" : "application/json",
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "GET, OPTIONS",
    "Access-Control-Allow-Headers" : "Content-Type"
  });
  res.end(JSON.stringify(data));
}

function buildDailyForecast(list) {
  const byDate = {};

  list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    if (!byDate[date]) byDate[date] = [];

    byDate[date].push(entry);
  })

  return Object.keys(byDate).slice(0,5).map(date => {
    const items = byDate[date];
    const mid = items[Math.floor(items.length / 2)];

    return
  })
}