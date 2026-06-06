import axios from "axios";

export const handler = async (event) => {
  try {
    const API_KEY = process.env.VITE_WEATHER_AI_KEY;

    const path = event.path.replace("/.netlify/functions/weather", "");
    const url = `https://api.weather-ai.co${path}`;

    const response = await axios.get(url, {
      params: event.queryStringParameters,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

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
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};