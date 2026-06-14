import { useEffect, useRef, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const wrapperRef = useRef(null);

  // 📦 LOAD HISTORY
  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(saved);
  }, []);

  // 🚪 CLICK OUTSIDE → CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 💾 SAVE HISTORY
  const saveSearch = (searchedCity) => {
    let updated = [
      searchedCity,
      ...history.filter(
        (item) =>
          item.toLowerCase() !== searchedCity.toLowerCase()
      ),
    ];

    updated = updated.slice(0, 5);

    setHistory(updated);
    localStorage.setItem("weatherHistory", JSON.stringify(updated));
  };

  // 🔎 SEARCH
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    saveSearch(city);
    onSearch(city);

    setCity("");
    setShowHistory(false);
  };

  // 📍 SELECT FROM HISTORY
  const handleHistoryClick = (selectedCity) => {
    setCity(selectedCity);
    onSearch(selectedCity);
    setShowHistory(false);
  };

  // ❌ REMOVE ONE
  const removeHistoryItem = (item) => {
    const updated = history.filter((h) => h !== item);
    setHistory(updated);
    localStorage.setItem("weatherHistory", JSON.stringify(updated));
  };

  // 🧹 CLEAR ALL
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("weatherHistory");
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex gap-2">

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setShowHistory(true)}   // 👈 show ONLY on focus
          placeholder="Search city..."
          className="
            flex-1 px-4 py-3 rounded-2xl

            bg-white/10 backdrop-blur-xl
            border border-black/70

            text-white placeholder-slate-300

            focus:outline-none
            focus:ring-2 focus:ring-sky-400/40
            focus:border-sky-400

            shadow-lg transition
          "
        />

        <button
          className="
            px-5 py-3 rounded-2xl

            bg-gradient-to-r from-sky-500 to-blue-600
            hover:scale-105 active:scale-95

            transition-all shadow-lg
            border border-black/40
          "
        >
          Search
        </button>
      </form>

    {/* HISTORY DROPDOWN */}
{showHistory && history.length > 0 && (
  <div
    className="
      absolute mt-3 w-full z-50

      rounded-3xl overflow-hidden

      bg-black/40 backdrop-blur-3xl
      border border-white/10

      shadow-[0_30px_80px_rgba(0,0,0,0.6)]

      animate-fade-in
    "
  >

    {/* HEADER */}
    <div className="
      flex justify-between items-center
      px-4 py-3

      border-b border-white/10
      bg-black/20
    ">
      <span className="text-xs text-slate-200 tracking-wide">
        Recent Searches
      </span>

      <button
        onClick={clearHistory}
        className="
          text-xs font-medium
          text-red-300
          hover:text-red-400
          transition
        "
      >
        Clear all
      </button>
    </div>

    {/* ITEMS */}
    {history.map((item, index) => (
      <div
        key={index}
        className="
          group flex items-center justify-between

          px-4 py-3

          border-b border-white/5

          hover:bg-white/10
          transition-all duration-200
        "
      >

        {/* LEFT CLICK AREA */}
        <button
          type="button"
          onClick={() => handleHistoryClick(item)}
          className="
            flex-1 text-left

            text-slate-100
            group-hover:text-sky-300

            transition
            font-medium
          "
        >
          <span className="mr-2 opacity-70">📍</span>
          {item}
        </button>

        {/* DELETE BUTTON */}
        <button
          type="button"
          onClick={() => removeHistoryItem(item)}
          className="
            w-8 h-8

            rounded-full

            text-slate-400
            hover:text-white
            hover:bg-red-500/20

            flex items-center justify-center

            transition
          "
        >
          ✕
        </button>

      </div>
    ))}

  </div>
)}

    </div>
  );
}