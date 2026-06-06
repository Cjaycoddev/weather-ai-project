import axios from "axios";

// 🔁 NOW CALL NETLIFY FUNCTION INSTEAD OF DIRECT API
const api = axios.create({
  baseURL: "/.netlify/functions/weather",
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