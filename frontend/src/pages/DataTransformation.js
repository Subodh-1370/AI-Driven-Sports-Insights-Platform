import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

const DataTransformation = () => {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const startTransformation = async () => {
    setStatus("transforming");
    setProgress(10);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/transformation/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Server error");

      setProgress(60);
      const data = await res.json();

      // Update results with new data from API
      setResults(data.data);
      setProgress(100);
      setStatus("completed");
      
      // Reset after 2 seconds to show completed state
      setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 2000);
    } catch (err) {
      console.error("Transformation error:", err);
      setStatus("error");
      setError("Transformation failed. Check backend.");
      setProgress(0);
    }
  };

  const badge = {
    idle: "bg-gray-200",
    transforming: "bg-purple-200",
    completed: "bg-green-200",
    error: "bg-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-600 p-2 rounded-lg">
          <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Data Transformation Pipeline</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Control */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Feature Engineering</h2>
          <button
            onClick={startTransformation}
            disabled={status === "transforming"}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            {status === "transforming" ? "Processing..." : "Start Transformation"}
          </button>

          <div className="mt-4">
            <div className="w-full bg-gray-200 h-3">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-3 bg-purple-600 rounded"
              />
            </div>
            <p className="text-sm mt-2">{progress}% completed</p>
          </div>

          <span className={`px-3 py-1 rounded text-sm ${badge[status]}`}>
            {status.toUpperCase()}
          </span>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Transformation Results</h2>

          {status === "transforming" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-purple-600 border-t-transparent border-l-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Processing transformation...</p>
            </div>
          )}

          {!results && status !== "transforming" && (
            <div className="text-center py-8">
              <p className="text-gray-500">No data processed yet. Click "Start Transformation" to begin.</p>
            </div>
          )}

          {results && status !== "transforming" && (
            <>
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xl font-bold">{results.features_created}</p>
                  <p className="text-sm text-gray-600">Features Created</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xl font-bold">{results.records_processed}</p>
                  <p className="text-sm text-gray-600">Records Processed</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xl font-bold">{results.data_quality_score}%</p>
                  <p className="text-sm text-gray-600">Data Quality Score</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-xl font-bold">{results.processing_time}</p>
                  <p className="text-sm text-gray-600">Processing Time</p>
                </div>
              </div>

              <h3 className="font-semibold mb-2">Engineered Features</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Player</th>
                      <th className="border p-2">Strike Rate</th>
                      <th className="border p-2">Batting Average</th>
                      <th className="border p-2">Form Index</th>
                      <th className="border p-2">Momentum Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.sample_features.map((player, i) => (
                      <tr key={i}>
                        <td className="border p-2 font-medium">{player.player}</td>
                        <td className="border p-2">{player.strike_rate}</td>
                        <td className="border p-2">{player.batting_average}</td>
                        <td className="border p-2">{player.form_index}</td>
                        <td className="border p-2">{player.momentum_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTransformation;
