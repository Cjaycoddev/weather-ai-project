import axios from "axios";

export const handler = async () => {
  try {
    const response = await axios.get(
      "https://api.weather-ai.co/v1/weather-geo",
      {
        params: {
          ip: "auto",
          ai: false,
        },
        headers: {
          Authorization: `Bearer ${process.env.VITE_WEATHER_AI_KEY}`,
        },
      }
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};