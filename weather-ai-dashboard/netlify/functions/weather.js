import axios from "axios";

export const handler = async () => {
  try {
    const res = await axios.get(
      "https://api.weather-ai.co/v1/weather-geo",
      {
        params: {
          ai: false,
        },
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
          city: d.location?.city || "Unknown",
          country: d.location?.country || "",
          lat: d.location?.lat || null,
          lon: d.location?.lon || null,
        },

        current: {
          temperature:
            d.current?.temperature ||
            d.current?.temp ||
            d.current?.temperature_2m ||
            0,

          condition_code:
            d.current?.condition_code ||
            d.current?.weather_code ||
            d.current?.code ||
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

              temp_min:
                day.temp_min ||
                day.min_temp ||
                day.temperature_min ||
                0,

              temp_max:
                day.temp_max ||
                day.max_temp ||
                day.temperature_max ||
                0,

              precipitation_probability:
                day.precipitation_probability ||
                day.precipitation ||
                0,

              wind_max:
                day.wind_max ||
                day.wind_speed_max ||
                0,

              icon: day.icon || "",
            }))
          : [],
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