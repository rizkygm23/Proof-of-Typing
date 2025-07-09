"use client"

import { useState, useEffect } from "react"
import { useMusicPlayer } from "@/hooks/use-music-player"

export function MusicPlayer() {
  const [showControls, setShowControls] = useState(false)
  const {
    isPlaying,
    isMuted,
    volume,
    currentTrack,
    tracks,
    togglePlay,
    toggleMute,
    setVolume,
    nextTrack,
    prevTrack,
    selectTrack,
    play,
  } = useMusicPlayer()
   useEffect(() => {
    play()
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Extended Controls */}
      {showControls && (
        <div className="mb-4 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-2 min-w-[320px]">
          {/* Current Track Info */}
          <div className="mb-4 text-center">
            <div className="text-white font-bold text-lg mb-1">{tracks[currentTrack].name}</div>
            <div className="text-cyan-400 text-sm">{tracks[currentTrack].artist}</div>
            <div className="text-gray-400 text-xs mt-1">
              Track {currentTrack + 1} of {tracks.length}
            </div>
          </div>

          {/* Track Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={prevTrack}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <span className="text-white">⏮️</span>
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110"
            >
              <span className="text-white text-lg">{isPlaying ? "⏸️" : "▶️"}</span>
            </button>

            <button
              onClick={nextTrack}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <span className="text-white">⏭️</span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white text-sm font-medium">Volume</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <span className="text-cyan-400 text-sm font-mono w-8">{Math.round(volume * 100)}</span>
            </div>
          </div>

          {/* Track Selector */}
          <div className="mb-4">
            <div className="text-white text-sm font-medium mb-2">Playlist</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {tracks.map((track, index) => (
                <button
                  key={index}
                  onClick={() => selectTrack(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                    index === currentTrack
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-cyan-400"
                      : "bg-gray-700/30 hover:bg-gray-600/30 text-gray-300 hover:text-white"
                  }`}
                >
                  <div className="font-medium">{track.name}</div>
                  <div className="text-xs opacity-75">{track.artist}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Music Attribution */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-700/50 pt-3">
            <div>🎵 Royalty-Free Music</div>
            <div className="text-cyan-400">Powered by Bensound</div>
          </div>
        </div>
      )}

      {/* Main Control Button */}
      <div className="relative">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          <div className="relative">
            <span className="text-3xl">🎵</span>
            {isPlaying && !isMuted && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className={`absolute -top-2 -right-2 w-9 h-9 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-sm font-bold ${
            isMuted
              ? "bg-red-500 border-red-400 text-white hover:bg-red-600 hover:scale-110"
              : "bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-600 hover:scale-110"
          }`}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Sound Waves Animation */}
        {isPlaying && !isMuted && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-ping animation-delay-75"></div>
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/10 animate-ping animation-delay-150"></div>
          </div>
        )}

        {/* Track Info Tooltip */}
        {isPlaying && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="font-medium">{tracks[currentTrack].name}</div>
            <div className="text-cyan-400">{tracks[currentTrack].artist}</div>
          </div>
        )}
      </div>
    </div>
  )
}
