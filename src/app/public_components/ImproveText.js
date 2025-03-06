"use client";

import { useState } from 'react';

export default function ImproveText({ statement, setStatement, isExternalClaims = false }) {
  const [isImproving, setIsImproving] = useState(false);
  const [improveError, setImproveError] = useState("");

  const handleImprove = async () => {
    setIsImproving(true);
    setImproveError("");

    const SPS_URL = process.env.NEXT_PUBLIC_SPS_SERVICE_URL;
    const proxyUrl = "https://thingproxy.freeboard.io/fetch/";

    if (!SPS_URL) {
      setImproveError("Service URL is missing. Check .env configuration.");
      setIsImproving(false);
      return;
    }

    if (statement.trim().length < 30) {
      setImproveError("Statement must be at least 30 characters long.");
      setIsImproving(false);
      return;
    }

    try {
      const response = await fetch(`${proxyUrl}${SPS_URL}/statements/improve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: statement,
          char_limit: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.detail) {
          const errorMessage = errorData.detail.map(err => err.msg).join(", ");
          setImproveError(errorMessage);
        } else {
          setImproveError(`Error: ${response.status} - ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();

      if (data.status === "improved") {
        setStatement(data.improved_text);
      } else {
        setImproveError("Failed to improve text. Try again.");
      }
    } catch (err) {
      setImproveError("Failed to connect to the API. The server may be blocking requests.");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="mb-2 flex justify-between items-center">
      <button
        onClick={handleImprove}
        className={`outlined-button px-8 py-4 text-md ${isExternalClaims || isImproving ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isExternalClaims || isImproving}
      >
        <span className="outlined-button-text">
          {isImproving ? "Improving..." : "Improve Text"}
        </span>
      </button>
      {improveError && (
        <div className="mt-2 bg-[#f8e6e6] text-[#B80003] p-4 rounded-md text-sm">
          {improveError}
        </div>
      )}
    </div>
  );
}