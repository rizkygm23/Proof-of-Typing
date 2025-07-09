"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

export function LocalMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playlist, setPlaylist] = useState<File[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => nextTrack()

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setPlaylist(files)
      setCurrentTrackIndex(0)
      loadTrack(files[0])
    }
  }

  const loadTrack = (file: File) => {
    if (audioRef.current) {
      const url = URL.createObjectURL(file)
      audioRef.current.src = url
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch(console.error)
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted
      setIsMuted(newMuted)
      audioRef.current.volume = newMuted ? 0 : volume
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = newVolume
    }
  }

  const nextTrack = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length
      setCurrentTrackIndex(nextIndex)
      loadTrack(playlist[nextIndex])
      if (isPlaying) {
        setTimeout(() => audioRef.current?.play(), 100)
      }
    }
  }

  const prevTrack = () => {
    if (playlist.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
      setCurrentTrackIndex(prevIndex)
      loadTrack(playlist[prevIndex])
      if (isPlaying) {
        setTimeout(() => audioRef.current?.play(), 100)
      }
    }
  }

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    loadTrack(playlist[index])
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getCurrentTrack = () => {
    return playlist[currentTrackIndex]
  }

  const removeFromPlaylist = (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index)
    setPlaylist(newPlaylist)

    if (index === currentTrackIndex && newPlaylist.length > 0) {
      const newIndex = Math.min(currentTrackIndex, newPlaylist.length - 1)
      setCurrentTrackIndex(newIndex)
      loadTrack(newPlaylist[newIndex])
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Controls Panel */}
      {showControls && (
        <div className="mb-4 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-2 min-w-[350px] max-w-[400px]">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="text-white font-bold text-lg mb-2 flex items-center justify-center gap-2">
              <span>🎵</span>
              Local Music Player
            </div>
            {getCurrentTrack() && (
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-cyan-400 text-sm font-medium truncate">
                  {getCurrentTrack().name.replace(/\.[^/.]+$/, "")}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Track {currentTrackIndex + 1} of {playlist.length}
                </div>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📁</span>
              {playlist.length > 0 ? "Add More Music" : "Choose Music Files"}
            </button>
          </div>

          {/* Playback Controls */}
          {playlist.length > 0 && (
            <>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(34 211 238) 0%, rgb(34 211 238) ${(currentTime / duration) * 100}%, rgb(55 65 81) ${(currentTime / duration) * 100}%, rgb(55 65 81) 100%)`,
                      }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={prevTrack}
                  disabled={playlist.length <= 1}
                  className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <span className="text-white">⏮️</span>
                </button>

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110"
                >
                  <span className="text-white text-xl">{isPlaying ? "⏸️" : "▶️"}</span>
                </button>

                <button
                  onClick={nextTrack}
                  disabled={playlist.length <= 1}
                  className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <span className="text-white">⏭️</span>
                </button>
              </div>

              {/* Volume Control */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
                    {isMuted ? "🔇" : "🔊"}
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <span className="text-cyan-400 text-sm font-mono w-8">{Math.round(volume * 100)}</span>
                </div>
              </div>

              {/* Playlist */}
              {playlist.length > 1 && (
                <div className="mb-4">
                  <div className="text-white text-sm font-medium mb-2 flex items-center justify-between">
                    <span>Playlist ({playlist.length} tracks)</span>
                    <button onClick={() => setPlaylist([])} className="text-red-400 hover:text-red-300 text-xs">
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {playlist.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                          index === currentTrackIndex
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-cyan-400"
                            : "bg-gray-700/30 hover:bg-gray-600/30 text-gray-300 hover:text-white"
                        }`}
                      >
                        <button onClick={() => selectTrack(index)} className="flex-1 text-left truncate">
                          {file.name.replace(/\.[^/.]+$/, "")}
                        </button>
                        <button
                          onClick={() => removeFromPlaylist(index)}
                          className="text-red-400 hover:text-red-300 text-xs w-6 h-6 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Info */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-700/50 pt-3">
            <div>🎵 Supports MP3, WAV, OGG, M4A</div>
            <div className="text-cyan-400">Your music, your vibe!</div>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 border border-purple-500/50 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center hover:scale-110 relative"
      >
        <span className="text-3xl">📁</span>
        {isPlaying && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}

        {/* Sound waves */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-pink-400/20 animate-ping animation-delay-75"></div>
          </div>
        )}
      </button>

      {/* Track info tooltip */}
      {getCurrentTrack() && isPlaying && (
        <div className="absolute bottom-full left-0 mb-2 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 max-w-[200px]">
          <div className="font-medium truncate">{getCurrentTrack().name.replace(/\.[^/.]+$/, "")}</div>
          <div className="text-cyan-400">Playing from local files</div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  )
}
