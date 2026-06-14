import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
      {/* MAIN WRAPPER */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
            Weather AI Dashboard
          </h1>

          <p className="text-slate-400 mt-3 text-sm md:text-base">
            Search cities or view live weather from your location
          </p>
        </div>

        {/* PAGE CONTENT */}
        <Home />

      </div>
    </div>
  );
}