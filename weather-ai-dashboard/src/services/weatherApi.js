import axios from "axios";

// 🌍 AUTO WEATHER (Netlify Function)
export const getAutoWeather = async () => {
  const res = await fetch("/.netlify/functions/weather");
  return await res.json();
};

// 🌦️ WEATHER BY COORDINATES (Netlify Function)
export const getWeatherByCoords = async (lat, lon) => {
  const res = await fetch(
    `/.netlify/functions/weather-coords?lat=${lat}&lon=${lon}`
  );
  return await res.json();
};