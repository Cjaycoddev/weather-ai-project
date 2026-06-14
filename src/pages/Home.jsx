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
  const [useGPS, setUseGPS] = useState(false);

  // 🌀 FORCE CARD ANIMATION RESET
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    loadAutoWeather();
  }, []);

  const loadAutoWeather = async () => {
    try {
      setLoading(true);
      setError("");

      const getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      let lat, lon;

      try {
        const pos = await getPosition();
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        setUseGPS(true);
      } catch (gpsError) {
        console.warn("GPS blocked → fallback IP");
        setUseGPS(false);

        const data = await getAutoWeather();
        setWeather(data);
        setFlipKey((k) => k + 1);
        return;
      }

      const weatherData = await getWeatherByCoords(lat, lon);
      
      console.log("Weather Data:", weatherData);

      setWeather({
        ...weatherData,
        location: {
          ...weatherData.location,
          lat,
          lon,
          source: "gps",
        },
      });

      setFlipKey((k) => k + 1);

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
      setUseGPS(false);

      const location = await getLocation(city);

      const weatherData = await getWeatherByCoords(
        location.lat,
        location.lon
      );

      setWeather({
        ...weatherData,
        location,
      });

      setFlipKey((k) => k + 1);

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

  // 🌍 FLAGS (GLOBAL SUPPORT)
  const getFlagUrl = (country) => {
    if (!country) return "";

    const code = String(country).toLowerCase();

    const map = {
      kenya: "ke",
      uganda: "ug",
      tanzania: "tz",
      rwanda: "rw",
      burundi: "bi",
      "united states": "us",
      usa: "us",
      "united kingdom": "gb",
      germany: "de",
      france: "fr",
      canada: "ca",
      india: "in",
      china: "cn",
      japan: "jp",
      brazil: "br",
      nigeria: "ng",
      southafrica: "za",
    };

    const iso = code.length === 2 ? code : map[code];

    if (!iso) return "";

    return `https://flagcdn.com/w40/${iso}.png`;
  };

  // 📍 LOCATION FIX (REAL LAT/LON KEYS)
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
      source: location.source || "api",
    };
  };

  const formattedLocation = formatLocation(weather?.location);
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackground()} text-white`}>

      {/* HEADER */}
      <div className="flex flex-col items-center gap-4 pt-6">
        <SearchBar onSearch={handleSearch} />

        <button
          onClick={loadAutoWeather}
          className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl backdrop-blur text-sm"
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

      {/* LOCATION CARD */}
      {formattedLocation && (
        <div className="flex justify-center mt-6">

          <div className="px-5 py-3 bg-white/10 rounded-full backdrop-blur flex items-center gap-3">

            {formattedLocation.flagUrl && (
              <img
                src={formattedLocation.flagUrl}
                className="w-6 h-4 rounded-sm shadow"
              />
            )}

            {/* 🔵 LIVE DOT ONLY FOR GPS */}
            {useGPS && formattedLocation.source === "gps" && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative h-3 w-3 rounded-full bg-green-500"></span>
                </span>
                <span className="text-green-300 text-xs"></span>
              </div>
            )}

            <span>
              📍 {formattedLocation.display}, {formattedLocation.country}
            </span>

            {/* LAT/LON ALWAYS BLACK */}
            <span className="text-black text-xs ml-2">
              {formattedLocation.coords.lat?.toFixed(6)},{" "}
              {formattedLocation.coords.lon?.toFixed(6)}
            </span>

          </div>
        </div>
      )}

      {/* WEATHER CARDS (FIXED FLIP TRIGGER) */}
      {weather && (
        <div
          key={flipKey}
          className="space-y-6 mt-6 animate-fade-in"
        >
          <WeatherCard current={weather.current} />
          <ForecastCard daily={weather.daily} />
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-16 text-center pb-6 text-sm text-gray-300">
        Weather AI Dashboard <br />
        Built by Jonah Kimani © 2026
      </div>

    </div>
  );
}