import axios from "axios";

export const handler = async (event) => {
  try {
    const { path, queryStringParameters } = event;

    const API_KEY = process.env.VITE_WEATHER_AI_KEY;

    const baseURL = "https://api.weather-ai.co";

    const endpoint = path.replace("/.netlify/functions/weather", "");

    const url = `${baseURL}${endpoint}`;

    const response = await axios.get(url, {
      params: queryStringParameters,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Serverless function failed",
      }),
    };
  }
};