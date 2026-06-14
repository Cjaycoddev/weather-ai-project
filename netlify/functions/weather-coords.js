import axios from "axios";

export const handler = async (event) => {
  try {
    const { lat, lon } = event.queryStringParameters;

    const res = await axios.get(
      "https://api.weather-ai.co/v1/weather",
      {
        params: {
          lat,
          lon,
          ai: false,
        },
        headers: {
          Authorization: `Bearer ${process.env.WEATHER_API_KEY}`,
        },
      }
    );

    const data = res.data;

    return {
      statusCode: 200,
      body: JSON.stringify({
        current: data.current || data.current_weather || {},
        daily: data.daily || data.forecast || [],
        location: data.location || data.location_info || {},
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};