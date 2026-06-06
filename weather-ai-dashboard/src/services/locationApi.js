import axios from "axios";

export const getLocation = async (city) => {
  const res = await axios.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      params: {
        name: city,
        count: 1,
        language: "en",
        format: "json",
      },
    }
  );

  if (!res.data.results?.length) {
    throw new Error("City not found");
  }

  const place = res.data.results[0];

  return {
    city: place.name,
    country: place.country,
    lat: place.latitude,
    lon: place.longitude,
  };
};