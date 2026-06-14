import axios from "axios";

export const handler = async (event) => {
  try {
    const API_KEY = process.env.WEATHER_AI_KEY;

    const path = event.path.replace(
      "/.netlify/functions/weather",
      ""
    );

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
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(error.response?.data || error.message);
    console.log(JSON.stringify(data, null, 2));
    return {
      statusCode: error.response?.status || 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        error.response?.data || {
          error: error.message,
        }
      ),
    };
  }
};