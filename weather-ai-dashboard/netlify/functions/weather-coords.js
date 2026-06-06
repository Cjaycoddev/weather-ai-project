import axios from "axios";

export const handler = async () => {
  const response = await axios.get(
    "https://api.weather-ai.co/v1/weather-geo",
    {
      params: { ip: "auto", ai: false },
      headers: {
        Authorization: `Bearer ${process.env.VITE_WEATHER_AI_KEY}`,
      },
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify(response.data),
  };
};