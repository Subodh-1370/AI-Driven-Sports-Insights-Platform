import React, { useState } from "react";
import { motion } from "framer-motion";
import { FunnelIcon } from "@heroicons/react/24/outline";

const DataCleaning = () => {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const startCleaning = async () => {
    setStatus("cleaning");
    setProgress(10);
    setError("");
    // Don't set results to null, keep the default data visible

    try {
      const res = await fetch("http://localhost:8000/api/cleaning/start", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Server error");

      setProgress(60);
      const data = await res.json();

      setResults(data.data); // Update with new data from API
      setProgress(100);
      setStatus("completed");
    } catch (err) {
      setStatus("error");
      setError("Cleaning failed. Check backend.");
    }
  };

  const badge = {
    idle: "bg-gray-200",
    cleaning: "bg-blue-200",
    completed: "bg-green-200",
    error: "bg-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-600 p-2 rounded-lg">
          <FunnelIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Data Cleaning Pipeline</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Control */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Processing Control</h2>
          <button
            onClick={startCleaning}
            disabled={status === "cleaning"}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {status === "cleaning" ? "Processing..." : "Start Cleaning"}
          </button>

          <div className="mt-4">
            <div className="w-full bg-gray-200 h-3">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-3 bg-green-600 rounded"
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
          <h2 className="font-semibold mb-4">Cleaning Results</h2>

          {!results && (
            <div className="text-center py-8">
              <p className="text-gray-500">No data processed yet. Click "Start Cleaning" to begin.</p>
            </div>
          )}

          {results && (
            <>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xl font-bold">{results.beforeRecords}</p>
                  <p className="text-sm text-gray-600">Before Cleaning</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-xl font-bold">{results.removed}</p>
                  <p className="text-sm text-gray-600">Removed</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xl font-bold">{results.afterRecords}</p>
                  <p className="text-sm text-gray-600">Clean Records</p>
                </div>
              </div>

              <h3 className="font-semibold mb-2">Sample Cleaned Data</h3>
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Player</th>
                    <th className="border p-2">Runs</th>
                    <th className="border p-2">Strike Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {results.sample && results.sample.map((row, i) => (
                    <tr key={i}>
                      <td className="border p-2">{row.player}</td>
                      <td className="border p-2">{row.runs}</td>
                      <td className="border p-2">{row.strikeRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;
