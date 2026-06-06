import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";

import { getLocation } from "../services/locationApi";
import {
  getAutoWeather,
  getWeatherByCoords,
} from "../services/weatherApi";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAutoWeather();
  }, []);

  const loadAutoWeather = async () => {
    try {
      setLoading(true);
      setError("");

      // 🌍 DEVICE GPS FIRST
      const getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      let lat, lon;

      try {
        const pos = await getPosition();
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch (gpsError) {
        console.warn("GPS blocked, falling back to IP location");
        const data = await getAutoWeather();
        setWeather(data);
        return;
      }

      const weatherData = await getWeatherByCoords(lat, lon);

      setWeather({
        ...weatherData,
        location: {
          ...weatherData.location,
          lat,
          lon,
          source: "gps",
        },
      });

    } catch (err) {
      console.error(err);
      setError("Failed to load weather");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city) => {
    try {
      setLoading(true);
      setError("");

      const location = await getLocation(city);

      const weatherData = await getWeatherByCoords(
        location.lat,
        location.lon
      );

      setWeather({
        ...weatherData,
        location,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    const code = String(weather?.current?.condition_code ?? "");

    switch (code) {
      case "0":
        return "from-yellow-400 via-orange-500 to-pink-600";
      case "1":
      case "2":
      case "3":
        return "from-sky-400 via-blue-500 to-indigo-700";
      case "45":
      case "48":
        return "from-slate-500 via-slate-700 to-slate-900";
      case "51":
      case "53":
      case "55":
      case "61":
      case "63":
      case "65":
        return "from-blue-500 via-blue-700 to-slate-900";
      case "95":
      case "96":
      case "99":
        return "from-purple-700 via-slate-900 to-black";
      default:
        return "from-cyan-500 via-blue-600 to-indigo-900";
    }
  };

  // 🌍 FLAG FUNCTION
  const getFlagUrl = (country) => {
    if (!country) return "";

    const code = String(country).toLowerCase();

    const map = {
      kenya: "ke",
      uganda: "ug",
      tanzania: "tz",
      "united states": "us",
      usa: "us",
      "united kingdom": "gb",
      germany: "de",
      france: "fr",
      canada: "ca",
      india: "in",
    };

    const iso = code.length === 2 ? code : map[code];

    if (!iso) return "";

    return `https://flagcdn.com/w40/${iso}.png`;
  };

  // 📍 LOCATION FORMAT (FIXED SAFE KEYS)
  const formatLocation = (location) => {
    if (!location) return null;

    const city =
      location.city ||
      location.name ||
      location.town ||
      location.village ||
      location.timezone?.split("/")?.pop()?.replaceAll("_", " ") ||
      "";

    return {
      display: city,
      country: location.country || "",
      flagUrl: getFlagUrl(location.country),
      coords: {
        lat: location.lat || location.latitude,
        lon: location.lon || location.longitude,
      },
    };
  };

  const formattedLocation = formatLocation(weather?.location);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackground()} text-white`}>
      
      <div className="flex flex-col items-center gap-4 pt-6">
        <SearchBar onSearch={handleSearch} />

        <button
          onClick={loadAutoWeather}
          className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl backdrop-blur text-sm"
        >
          📍 My Location
        </button>
      </div>

      {loading && (
        <div className="text-center mt-6 text-blue-300">
          Loading weather...
        </div>
      )}

      {error && (
        <div className="text-center mt-6 text-red-400">
          {error}
        </div>
      )}

      {formattedLocation && (
        <div className="flex justify-center mt-6">
          <div className="px-5 py-3 bg-white/10 rounded-full backdrop-blur flex items-center gap-2">

            {formattedLocation.flagUrl && (
              <img
                src={formattedLocation.flagUrl}
                alt="flag"
                className="w-6 h-4 rounded-sm shadow"
              />
            )}

            <span>
              📍 {formattedLocation.display}, {formattedLocation.country}
            </span>

          </div>
        </div>
      )}

      {weather && (
        <div className="space-y-6 mt-6">
          <WeatherCard current={weather.current} />
          <ForecastCard daily={weather.daily} />
        </div>
      )}

      <div className="mt-16 text-center pb-6 text-sm text-gray-300">
        Weather AI Dashboard <br />
        Built by Jonah Kimani © 2026
      </div>
    </div>
  );
}