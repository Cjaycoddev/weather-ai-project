import axios from "axios";

const api = axios.create({
  baseURL: "https://api.weather-ai.co",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_WEATHER_AI_KEY}`,
  },
});

// 🌍 AUTO WEATHER (WORKING)
export const getAutoWeather = async () => {
  const res = await api.get("/v1/weather-geo", {
    params: {
      ip: "auto",
      ai: false,
    },
  });

  return res.data;
};

// 🌦️ COORDINATES WEATHER
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