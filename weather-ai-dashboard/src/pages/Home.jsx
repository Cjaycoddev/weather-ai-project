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

  // 🎨 BACKGROUND CONTROL (FIXED)
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

  // 🌍 FLAG URL (REAL PNG FLAGS)
  const getFlagUrl = (country) => {
    if (!country) return "";
  
    const value = String(country).trim().toLowerCase();
  
    // 🌍 small fallback aliases for messy API outputs
    const aliases = {
      "united states": "us",
      usa: "us",
      "united kingdom": "gb",
      uk: "gb",
      england: "gb",
    };
  
    let iso = "";
  
    // CASE 1: already ISO2 (KE, US, TZ, etc.)
    if (value.length === 2) {
      iso = value;
    }
  
    // CASE 2: known aliases
    else if (aliases[value]) {
      iso = aliases[value];
    }
  
    // CASE 3: smart fallback using first letters (better than nothing)
    else {
      // try to extract first 2 letters of words (more stable than slice)
      const parts = value.split(" ");
      if (parts.length >= 2) {
        iso = (parts[0][0] + parts[1][0]);
      } else {
        iso = value.slice(0, 2);
      }
    }
  
    return `https://flagcdn.com/w40/${iso}.png`;
  };
  
  const countryNameMap = {
    KE: "Kenya",
    US: "United States",
    TZ: "Tanzania",
    UG: "Uganda",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    CA: "Canada",
    IN: "India",
  };
  // 📍 LOCATION FORMAT
  const formatLocation = (location) => {
    if (!location) return null;

    const city =
      location.city ||
      location.name ||
      location.town ||
      location.village ||
      location.timezone?.split("/")?.pop()?.replaceAll("_", " ") ||
      "Unknown";

    return {
      display: city,
      country:
      countryNameMap[String(location.country).toUpperCase()] ||
      location.country ||
      "",
      flagUrl: getFlagUrl(location.country),
      coords: {
        lat: location.lat,
        lon: location.lon,
      },
    };
  };

  const formattedLocation = formatLocation(weather?.location);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getBackground()} text-white transition-all duration-700`}
    >

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

            {/* TOP ROW */}
            <div className="flex items-center gap-2">

              {/* LIVE DOT */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>

              {/* FLAG + TEXT */}
              <div className="flex items-center gap-2">

                {formattedLocation.flagUrl && (
                  <img
                    src={formattedLocation.flagUrl}
                    alt="flag"
                    className="w-6 h-4 rounded-sm shadow"
                  />
                )}

                <span className="text-sm text-black-200 font-medium">
                  📍 {formattedLocation.display}, {formattedLocation.country}
                </span>

              </div>
            </div>

            {/* COORDINATES */}
            <span className="text-xs text-black-400">
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
            key={weather?.current?.time + weather?.location?.timezone}
            daily={weather.daily}
          />

        </div>
      )}

      {/* FOOTER */}
      <div className="mt-16 text-center pb-6 text-black400 text-sm">
        Weather AI Dashboard <br />
        <span className="text-xs text-black-500">
          Built by Jonah Kimani<br/>
          Copyright@2026
        </span>
      </div>

    </div>
  );
}