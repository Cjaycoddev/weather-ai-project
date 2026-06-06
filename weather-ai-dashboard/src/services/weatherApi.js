import axios from "axios";

// 🔁 IMPORTANT: this now hits Netlify rewrite (/api → Weather AI)
const api = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_WEATHER_AI_KEY}`,
  },
});

// 🌍 AUTO WEATHER (IP BASED)
export const getAutoWeather = async () => {
  try {
    const res = await api.get("/v1/weather-geo", {
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

// 🌦️ WEATHER BY COORDINATES
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const res = await api.get("/v1/weather", {
      params: {
        lat,
        lon,
        ai: false,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Weather by coords error:", err);
    throw err;
  }
};