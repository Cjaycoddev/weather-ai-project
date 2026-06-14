const getConditionText = (code) => {
  switch (String(code)) {
    case "0":
      return "Clear Sky";
    case "1":
      return "Mainly Clear";
    case "2":
      return "Partly Cloudy";
    case "3":
      return "Overcast";
    case "45":
    case "48":
      return "Fog";
    case "51":
    case "53":
    case "55":
      return "Drizzle";
    case "61":
      return "Light Rain";
    case "63":
      return "Moderate Rain";
    case "65":
      return "Heavy Rain";
    case "71":
      return "Light Snow";
    case "73":
      return "Moderate Snow";
    case "75":
      return "Heavy Snow";
    case "95":
      return "Thunderstorm";
    default:
      return "Unknown";
  }
};

/* 🌤️ ANIMATED WEATHER VISUALS */
const WeatherVisual = ({ code, icon }) => {
  const c = String(code);

  // ☀️ CLEAR SKY
  if (c === "0") {
    return (
      <div className="relative w-36 h-36 flex items-center justify-center">
        <div className="sun-core"></div>
        <div className="sun-rays"></div>
      </div>
    );
  }

  // ☁️ CLOUDY
  if (["1", "2", "3"].includes(c)) {
    return (
      <div className="cloud-float text-5xl">
        ☁️
      </div>
    );
  }

  // 🌧 RAIN
  if (["51", "53", "55", "61", "63", "65"].includes(c)) {
    return (
      <div className="relative w-36 h-36 flex items-center justify-center">
        <div className="text-4xl mb-2">☁️</div>
        <div className="rain">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  // ⛈ STORM
  if (["95", "96", "99"].includes(c)) {
    return (
      <div className="relative w-36 h-36 flex items-center justify-center">
        <div className="text-5xl">⛈</div>
        <div className="lightning"></div>
      </div>
    );
  }

  // 🌫 FOG
  if (["45", "48"].includes(c)) {
    return (
      <div className="fog text-5xl">
        🌫
      </div>
    );
  }

  // FALLBACK
  return (
    <img src={icon} alt="weather icon" className="w-36 h-36 drop-shadow-2xl" />
  );
};

export default function WeatherCard({
  current,
  city,
  country,
}) {
  if (!current) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT */}
        <div>
          {(city || country) && (
            <p className="text-slate-300 text-lg mb-2">
              📍 {city}
              {city && country ? ", " : ""}
              {country}
            </p>
          )}

          <h2 className="text-6xl font-bold">
            {current.temperature}°
          </h2>

          <p className="text-black-300 font-medium mt-2">
            {getConditionText(current.condition_code)}
          </p>

          <p className="text-black-400 mt-2">
            Updated: {new Date(current.time).toLocaleString()}
          </p>
        </div>

        {/* RIGHT (ANIMATED ICON SYSTEM) */}
        <div className="flex flex-col items-center">
          <WeatherVisual
            code={current.condition_code}
            icon={current.icon}
          />

          <p className="text-black-300 text-sm mt-2">
            Powered by Weather AI
          </p>
        </div>

      </div>

      {/* WEATHER DETAILS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-black-400 text-sm">Temperature</p>
          <p className="font-bold text-xl">
            {current.temperature}°
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-black-400 text-sm">Wind Speed</p>
          <p className="font-bold text-xl">
            {current.wind_speed} km/h
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-black-400 text-sm">Wind Direction</p>
          <p className="font-bold text-xl">
            {current.wind_direction}°
          </p>
        </div>

      </div>
    </div>
  );
}