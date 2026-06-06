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
  const [isGPS, setIsGPS] = useState(false);

  useEffect(() => {
    loadAutoWeather();
  }, []);

  const loadAutoWeather = async () => {
    try {
      setLoading(true);
      setError("");

      setIsGPS(false); // reset GPS state first

      // 🌍 GPS FIRST
      const getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      try {
        const pos = await getPosition();

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const weatherData = await getWeatherByCoords(lat, lon);

        setWeather({
          ...weatherData,
          location: {
            ...weatherData.location,
            latitude: lat,
            longitude: lon,
          },
        });

        setIsGPS(true); // ✅ LIVE MODE ON
      } catch (gpsError) {
        // fallback IP
        const data = await getAutoWeather();
        setWeather(data);
        setIsGPS(false);
      }

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

      setIsGPS(false); // ❌ disable live dot on search

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

  // 🌍 FLAG FUNCTION (supports most countries via flagcdn fallback)
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

  // 📍 LOCATION FORMAT FIXED
  const formatLocation = (location) => {
    if (!location) return null;

    return {
      display:
        location.city ||
        location.name ||
        location.town ||
        location.village ||
        location.timezone?.split("/")?.pop()?.replaceAll("_", " ") ||
        "",
      country: location.country || "",
      flagUrl: getFlagUrl(location.country),
      coords: {
        lat: location.latitude || location.lat,
        lon: location.longitude || location.lon,
      },
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
        <div className="text-center mt-6 text-blue-300">
          Loading weather...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-center mt-6 text-red-400">
          {error}
        </div>
      )}

      {/* LOCATION + GPS INDICATOR */}
      {formattedLocation && (
        <div className="flex justify-center mt-6">

          <div className="px-5 py-3 bg-white/10 rounded-full backdrop-blur flex items-center gap-3">

            {formattedLocation.flagUrl && (
              <img
                src={formattedLocation.flagUrl}
                alt="flag"
                className="w-6 h-4 rounded-sm shadow"
              />
            )}

            {/* 🟢 LIVE DOT ONLY WHEN GPS ACTIVE */}
            {isGPS && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}

            <span className="text-white font-medium">
              📍 {formattedLocation.display}, {formattedLocation.country}
            </span>

          </div>
        </div>
      )}

      {/* COORDINATES (BLACK + FULL PRECISION) */}
      {formattedLocation && (
        <div className="text-center mt-2 text-black text-sm font-semibold">
          Latitude: {formattedLocation.coords.lat} | Longitude: {formattedLocation.coords.lon}
        </div>
      )}

      {/* WEATHER */}
      {weather && (
        <div className="space-y-6 mt-6">
          <WeatherCard
            key={weather?.current?.time}   // 🔁 restores flip animation trigger
            current={weather.current}
          />
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