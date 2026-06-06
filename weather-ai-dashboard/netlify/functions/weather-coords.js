import axios from "axios";

export const handler = async (event) => {
  try {
    const { lat, lon } = event.queryStringParameters;

    const res = await axios.get(
      "https://api.weather-ai.co/v1/weather",
      {
        params: { lat, lon, ai: false },
        headers: {
          Authorization: `Bearer ${process.env.VITE_WEATHER_AI_KEY}`,
        },
      }
    );

    const d = res.data;

    return {
      statusCode: 200,
      body: JSON.stringify({
        location: {
          lat,
          lon,
        },

        current: {
          temperature:
            d.current?.temperature ||
            d.current?.temp ||
            0,

          condition_code:
            d.current?.condition_code ||
            d.current?.weather_code ||
            "0",

          wind_speed:
            d.current?.wind_speed ||
            d.current?.windspeed ||
            0,

          wind_direction:
            d.current?.wind_direction ||
            d.current?.winddir ||
            0,

          icon: d.current?.icon || "",
          time: d.current?.time || new Date().toISOString(),
        },

        daily: Array.isArray(d.daily)
          ? d.daily.map((day, i) => ({
              date: day.date || day.time || `Day ${i + 1}`,
              temp_min: day.temp_min || 0,
              temp_max: day.temp_max || 0,
              precipitation_probability: day.precipitation_probability || 0,
              wind_max: day.wind_max || 0,
              icon: day.icon || "",
            }))
          : [],
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};