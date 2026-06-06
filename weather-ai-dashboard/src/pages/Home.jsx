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

  // 🌍 AUTO LOAD
  useEffect(() => {
    loadAutoWeather();
  }, []);

  const loadAutoWeather = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAutoWeather();
      setWeather(data);

    } catch (err) {
      console.error(err);
      setError("Failed to load weather");
    } finally {
      setLoading(false);
    }
  };

  // 🔎 SEARCH
  const handleSearch = async (city) => {
    try {
      setLoading(true);
      setError("");

      const location = await getLocation(city);

      if (!location) {
        setError("City not found");
        return;
      }

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

  // 🎨 BACKGROUND CONTROL
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

  // 🌍 LOCATION DISPLAY (NO CUSTOM FIXES YET)
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
      country:
        location.country || "",
      coords: {
        lat: location.lat,
        lon: location.lon,
      },
    };
  };

  const formattedLocation = formatLocation(weather?.location);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackground()} text-white transition-all duration-700`}>
      
      {/* HEADER */}
      <div className="flex flex-col items-center gap-4 pt-6">
        <SearchBar onSearch={handleSearch} />

        <button
          onClick={loadAutoWeather}
          className="
            bg-white/10 hover:bg-white/20
            px-5 py-2 rounded-xl
            backdrop-blur
            transition text-sm
          "
        >
          📍 My Location
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-6 text-blue-300 animate-pulse">
          Loading weather...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-center mt-6 text-red-400">
          {error}
        </div>
      )}

      {/* LOCATION DISPLAY */}
      {formattedLocation && (
        <div className="flex justify-center mt-6">

          <div className="
            flex flex-col items-center gap-1
            px-5 py-3 rounded-full
            bg-white/10 backdrop-blur
            border border-white/10
            shadow-lg animate-fade-in
          ">

            <div className="flex items-center gap-2">
              <span className="text-green-400">📍</span>

              <span className="text-sm font-medium">
                📍 {formattedLocation.display}, {formattedLocation.country}
              </span>
            </div>

            <span className="text-xs text-gray-300">
              Latitude: {formattedLocation.coords.lat?.toFixed(2)} |
              Longitude: {formattedLocation.coords.lon?.toFixed(2)}
            </span>

          </div>
        </div>
      )}

      {/* WEATHER COMPONENTS */}
      {weather && (
        <div className="space-y-6 mt-6 animate-fade-in">

          <WeatherCard current={weather.current} />

          <ForecastCard
            daily={weather.daily}
          />

        </div>
      )}

      {/* FOOTER */}
      <div className="mt-16 text-center pb-6 text-sm text-gray-300">
        Weather AI Dashboard <br />
        <span className="text-xs text-gray-500">
          Built by Jonah Kimani © 2026
        </span>
      </div>

    </div>
  );
}