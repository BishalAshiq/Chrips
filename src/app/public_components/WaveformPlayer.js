"use client";

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveformPlayer = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer with full-width settings
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#D1D5DB", // Default gray for the entire waveform
      progressColor: "#15803D", // Green for played section
      barWidth: 3, // Adjusted for mobile
      barGap: 2,
      height: 50,
      responsive: true,
      backend: "mediaelement",
    });

    // Load the audio file
    wavesurferRef.current.load(audioUrl);

    // Update duration when ready
    wavesurferRef.current.on("ready", () => {
      const totalDuration = Math.floor(wavesurferRef.current.getDuration());
      setDuration(formatTime(totalDuration));
    });

    // Update current time as audio plays
    wavesurferRef.current.on("audioprocess", () => {
      const time = Math.floor(wavesurferRef.current.getCurrentTime());
      setCurrentTime(formatTime(time));
    });

    // Play/Pause state updates
    wavesurferRef.current.on("play", () => setIsPlaying(true));
    wavesurferRef.current.on("pause", () => setIsPlaying(false));

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioUrl]);

  // Play/Pause Handler
  const togglePlay = () => {
    if (!wavesurferRef.current) return;

    if (wavesurferRef.current.isPlaying()) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
  };

  // Format time (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "0.25rem", // Reduced from 0.625rem
        width: "100%", 
        maxWidth: "50rem", // Desktop max width
        padding: "0.625rem",
        position: "relative",
      }}
    >
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        style={{ 
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: "0.25rem", // Reduced from 0.625rem
          display: "flex",
          alignItems: "center"
        }}
      >
        {isPlaying ? (
          <svg width="2rem" height="2rem" viewBox="0 0 18 18" fill="currentColor">
            <path d="M5 4v10h2V4H5zm6 0v10h2V4h-2z" />
          </svg>
        ) : (
          <svg width="2rem" height="2rem" viewBox="0 0 18 18" fill="currentColor">
            <path d="M5 4l10 5-10 5V4z" />
          </svg>
        )}
      </button>

      {/* Waveform - Fully Responsive */}
      <div 
        ref={waveformRef} 
        style={{ 
          flex: 1, 
          minWidth: "8rem",  // ✅ Mobile-friendly width
          maxWidth: "36rem",  // ✅ Expands on larger screens
          width: "100%",
        }} 
      ></div>

      {/* Time Display - Always Visible */}
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          minWidth: "4rem", // Reduced from 5rem
          textAlign: "center",
          fontSize: "0.875rem",
          marginLeft: "0.25rem" // Added small margin
        }}
      >
        <span style={{ fontWeight: "bold", color: "#374151" }}>{currentTime}</span>
        <span style={{ color: "#4B5563" }}>{duration}</span>
      </div>
    </div>
  );
};

export default WaveformPlayer;
