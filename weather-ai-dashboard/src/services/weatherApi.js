import axios from "axios";

// 🌍 AUTO (user location)
export const getAutoWeather = async () => {
  const res = await axios.get("/.netlify/functions/weather");
  return res.data;
};

// 🌦️ WEATHER BY COORDINATES
export const getWeatherByCoords = async (lat, lon) => {
  const res = await axios.get("/.netlify/functions/weather-coords", {
    params: { lat, lon },
  });

  return res.data;
};