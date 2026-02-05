import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon } from "@heroicons/react/24/outline";

const Scraper = () => {
  const [isScraping, setIsScraping] = useState(false);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [scrapedData, setScrapedData] = useState(null);
  const [error, setError] = useState("");
  const [selectedSource, setSelectedSource] = useState("espncricinfo");
  const [customUrl, setCustomUrl] = useState("");

  const dataSources = [
    { id: "espncricinfo", name: "ESPN Cricinfo", url: "https://www.espncricinfo.com/" },
    { id: "cricbuzz", name: "Cricbuzz", url: "https://www.cricbuzz.com/" },
    { id: "ipl", name: "IPL Official", url: "https://www.iplt20.com/" },
    { id: "custom", name: "Custom URL", url: customUrl },
  ];

  // Simulated progress animation
  useEffect(() => {
    let interval;
    if (isScraping) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isScraping]);

  const handleStartScraping = async () => {
    setIsScraping(true);
    setStatus("scraping");
    setProgress(5);
    setError("");

    const selected = dataSources.find((s) => s.id === selectedSource);
    const targetUrl = selectedSource === "custom" ? customUrl : selected.url;

    try {
      const res = await fetch("http://localhost:8000/api/scraper/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, source: selectedSource }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      
      // Store the complete scraping response
      setScrapedData(data.data);
      setProgress(100);
      setStatus("completed");
      
      setTimeout(() => {
        setIsScraping(false);
        setStatus("idle");
        setProgress(0);
      }, 2000);
    } catch (err) {
      setError("Scraping failed. Check backend server.");
      setStatus("error");
      setIsScraping(false);
    }
  };

  const statusColor = {
    idle: "bg-gray-200 text-gray-700",
    scraping: "bg-blue-200 text-blue-800",
    completed: "bg-green-200 text-green-800",
    error: "bg-red-200 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <HomeIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Sports Data Scraper</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Config Panel */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Source Configuration</h2>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
            {dataSources.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {selectedSource === "custom" && (
            <input
              type="url"
              placeholder="Enter custom URL"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
          )}

          <button
            onClick={handleStartScraping}
            disabled={isScraping}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isScraping ? "Scraping..." : "Start Scraping"}
          </button>
        </div>

        {/* Status Panel */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Scraping Status</h2>

          <span className={`px-3 py-1 rounded-full text-sm ${statusColor[status]}`}>
            {status.toUpperCase()}
          </span>

          {isScraping && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-3 bg-blue-600 rounded"
                />
              </div>
              <p className="text-sm mt-2">{progress}% completed</p>
            </div>
          )}

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
      </div>

      {/* Industry-Standard Results Panel */}
      {scrapedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Scraping Results</h2>
            
            {/* Success Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{scrapedData.matches_scraped}</p>
                <p className="text-sm text-gray-600">Matches Scraped</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{scrapedData.players_scraped}</p>
                <p className="text-sm text-gray-600">Players Scraped</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-purple-600">{scrapedData.records_scraped}</p>
                <p className="text-sm text-gray-600">Records Scraped</p>
              </div>
            </div>

            {/* Processing Time */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Processing Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Scraping Time:</span>
                  <span className="font-medium ml-2">{scrapedData.scraping_time}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium ml-2 text-green-600">{scrapedData.status.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Sample Data Table */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Sample Scraped Data</h3>
              
              {/* Sample Matches */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">📋 Sample Matches</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border px-4 py-2 text-left">Match ID</th>
                        <th className="border px-4 py-2 text-left">Team 1</th>
                        <th className="border px-4 py-2 text-left">Team 2</th>
                        <th className="border px-4 py-2 text-left">Winner</th>
                        <th className="border px-4 py-2 text-left">Venue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scrapedData.sample_data.matches.map((match, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{match.match_id}</td>
                          <td className="border px-4 py-2">{match.team1}</td>
                          <td className="border px-4 py-2">{match.team2}</td>
                          <td className="border px-4 py-2 font-medium text-green-600">{match.winner}</td>
                          <td className="border px-4 py-2">{match.venue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Players */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">👤 Sample Players</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border px-4 py-2 text-left">Player Name</th>
                        <th className="border px-4 py-2 text-left">Total Runs</th>
                        <th className="border px-4 py-2 text-left">Average</th>
                        <th className="border px-4 py-2 text-left">Strike Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scrapedData.sample_data.players.map((player, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border px-4 py-2 font-medium">{player.player_name}</td>
                          <td className="border px-4 py-2">{player.total_runs}</td>
                          <td className="border px-4 py-2">{player.average}</td>
                          <td className="border px-4 py-2">{player.strike_rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Scraper;
