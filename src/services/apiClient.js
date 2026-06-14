import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_AI_KEY;

/**
 * This replaces direct calls to weather-ai API
 * Fixes CORS in production
 */
export const apiClient = axios.create({
  baseURL: "https://api.weather-ai.co",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
  timeout: 10000,
});