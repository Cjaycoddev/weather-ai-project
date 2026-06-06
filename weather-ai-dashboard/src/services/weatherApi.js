import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_AI_KEY;

const api = axios.create({
  baseURL: "https://api.weather-ai.co",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

// 🌍 AUTO WEATHER
export const getAutoWeather = async () => {
  const res = await api.get("/v1/weather-geo", {
    params: {
      ip: "auto",
      ai: false,
    },
  });

  return res.data;
};

// 🌦️ WEATHER BY COORDS
export const getWeatherByCoords = async (lat, lon) => {
  const res = await api.get("/v1/weather", {
    params: {
      lat,
      lon,
      ai: false,
    },
  });

  return res.data;
};