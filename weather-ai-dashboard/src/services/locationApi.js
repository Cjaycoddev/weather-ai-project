import axios from "axios";

// 🌍 CITY SEARCH
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

// 🌍 GPS LOCATION
export const getGPSLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => reject(err.message),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
};

// 🌍 REVERSE GEOCODING (FIX UNKNOWN ISSUE)
export const getCityFromCoords = async (lat, lon) => {
  const res = await axios.get(
    "https://geocoding-api.open-meteo.com/v1/reverse",
    {
      params: {
        latitude: lat,
        longitude: lon,
      },
    }
  );

  const data = res.data;

  return {
    city: data?.name || "Unknown",
    country: data?.country || "",
  };
};