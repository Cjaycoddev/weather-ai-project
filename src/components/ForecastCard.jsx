export default function ForecastCard({ daily }) {
  if (!daily || daily.length === 0) return null;

  return (
    <div className="mt-8">

      <h2 className="text-2xl font-bold mb-6 text-white">
        {daily.length}-Day Forecast
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {daily.map((day, index) => (
          <div
            key={`${day.date}-${index}`}
            className="forecast-card bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl hover:scale-105 transition-all"
            style={{
              animation: `spinCard 1s ease ${index * 0.12}s both`
            }}
          >

            <p className="text-xs text-sky-300">
              Day {index + 1}
            </p>

            <p className="font-semibold text-white">
              {day.date}
            </p>

            {day.icon && (
              <img
                src={day.icon}
                alt="weather"
                className="w-20 h-20 mx-auto my-3"
              />
            )}

            <p className="text-slate-200">
              🌡️ {day.temp_min}°C - {day.temp_max}°C
            </p>

            <p className="text-slate-300 text-sm">
              🌧️ Rain: {day.precipitation_probability}%
            </p>

            <p className="text-slate-300 text-sm">
              💨 Wind: {day.wind_max} km/h
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}