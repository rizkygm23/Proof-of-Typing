"use client"

import { useState, useEffect, useRef } from "react"

export function useMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Cyberpunk/Synthwave music tracks (royalty-free)
  const tracks = [
    {
      name: "Cyber Dreams",
      url: "/music1.mp3",
      artist: "Bensound",
    },
    {
      name: "Digital Love",
      url: "/music2.mp3",
      artist: "bes",
    },
    {
      name: "Neon Nights",
      url: "/music3.mp3",
      artist: "Bensound",
    },
    {
      name: "Synthwave Vibes",
      url: "/music4.mp3",
      artist: "Bensound",
    },
  ]

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = volume
    audioRef.current.crossOrigin = "anonymous"

    // Set initial track
    audioRef.current.src = tracks[currentTrack].url

    // Load saved preferences
    const savedMuted = localStorage.getItem("music-muted")
    const savedVolume = localStorage.getItem("music-volume")
    const savedTrack = localStorage.getItem("current-track")

    if (savedMuted) {
      setIsMuted(JSON.parse(savedMuted))
    }

    if (savedVolume) {
      const vol = Number.parseFloat(savedVolume)
      setVolume(vol)
      audioRef.current.volume = vol
    }

    if (savedTrack) {
      const trackIndex = Number.parseInt(savedTrack)
      setCurrentTrack(trackIndex)
      audioRef.current.src = tracks[trackIndex].url
    }

    // Handle track end (for non-loop mode)
    const handleEnded = () => {
      nextTrack()
    }

    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded)
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [isMuted, volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].url
      localStorage.setItem("current-track", currentTrack.toString())

      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentTrack])

  const play = () => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(console.error)
      setIsPlaying(true)
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    localStorage.setItem("music-muted", JSON.stringify(newMuted))

    if (newMuted) {
      pause()
    } else if (!isPlaying) {
      play()
    }
  }

  const setVolumeLevel = (newVolume: number) => {
    setVolume(newVolume)
    localStorage.setItem("music-volume", newVolume.toString())
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume
    }
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  const selectTrack = (index: number) => {
    setCurrentTrack(index)
  }

  return {
    isPlaying,
    isMuted,
    volume,
    currentTrack,
    tracks,
    play,
    pause,
    togglePlay,
    toggleMute,
    setVolume: setVolumeLevel,
    nextTrack,
    prevTrack,
    selectTrack,
  }
}
