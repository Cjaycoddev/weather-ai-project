import axios from "axios";

const api = axios.create({
  baseURL: "/.netlify/functions/weather",
});

export const getAutoWeather = async () => {
  const res = await api.get("/v1/weather-geo", {
    params: { ip: "auto", ai: false },
  });

  return res.data;
};

export const getWeatherByCoords = async (lat, lon) => {
  const res = await api.get("/v1/weather", {
    params: { lat, lon, ai: false },
  });

  return res.data;
};