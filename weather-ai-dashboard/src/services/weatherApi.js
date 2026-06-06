import { apiClient } from "./apiClient";

// 🌍 AUTO WEATHER
export const getAutoWeather = async () => {
  try {
    const res = await apiClient.get("/v1/weather-geo", {
      params: {
        ip: "auto",
        ai: false,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Auto weather error:", err);
    throw err;
  }
};

// 🌦️ WEATHER BY COORDS
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const res = await apiClient.get("/v1/weather", {
      params: {
        lat,
        lon,
        ai: false,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Weather coords error:", err);
    throw err;
  }
};