"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface LeaderboardEntry {
  id: number
  username: string
  proof_hash: string
  wpm: number
  created_at: string
}

export default function TypingLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("proofType").select("*").order("wpm", { ascending: false }).limit(50)

      if (error) {
        throw error
      }

      setLeaderboard(data || [])
    } catch (err) {
      console.error("Error fetching leaderboard:", err)
      setError("Failed to load leaderboard")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "👑"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return "⚡"
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-400"
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50 text-gray-300"
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50 text-amber-400"
      default:
        return "bg-gray-800/50 border-gray-700/50 text-white"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl mb-6 shadow-2xl shadow-cyan-500/25">
            <span className="text-2xl">👑</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Loading Leaderboard...
          </h1>
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold text-red-400 mb-4">Connection Error</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-8 shadow-2xl shadow-yellow-500/25">
            <span className="text-3xl">👑</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              LEADERBOARD
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <span className="text-yellow-400 font-mono text-sm tracking-wider">HALL OF FAME</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>

          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            The fastest verified typists in the cryptographic realm. Every record is immutably proven.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/"
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 text-white font-medium py-3 px-6 rounded-xl hover:border-gray-600 transition-all duration-300 flex items-center gap-2"
          >
            <span>←</span>
            Home
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-4xl mb-4">👥</div>
            <div className="text-3xl font-bold text-cyan-400 mb-2">{leaderboard.length}</div>
            <div className="text-gray-400">Total Champions</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-4xl mb-4">⚡</div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {leaderboard.length > 0 ? `${leaderboard[0].wpm}` : "0"}
            </div>
            <div className="text-gray-400">Fastest WPM</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-4xl mb-4">🔐</div>
            <div className="text-3xl font-bold text-purple-400 mb-2">{leaderboard.length}</div>
            <div className="text-gray-400">ZK Proofs</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              Top Performers
            </h2>
            <button
              onClick={fetchLeaderboard}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-2 px-4 rounded-xl shadow-md hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
            >
              🔄 Refresh
            </button>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Records Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Be the first to establish a cryptographically verified typing record
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <span className="text-2xl">🚀</span>
                Start Challenge
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => {
                const rank = index + 1
                return (
                  <div
                    key={entry.id}
                    className={`${getRankStyle(rank)} backdrop-blur-xl border rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Rank */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-3xl">{getRankEmoji(rank)}</span>
                          <div className="text-center">
                            <div className="font-bold text-2xl">#{rank}</div>
                            <div className="text-xs opacity-75">RANK</div>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl">@</span>
                            <span className="font-bold text-xl truncate">{entry.username}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm opacity-75">
                            <span>🔐</span>
                            <span className="font-mono truncate">{entry.proof_hash.substring(0, 16)}...</span>
                          </div>
                        </div>
                      </div>

                      {/* WPM & Date */}
                      <div className="text-right shrink-0">
                        <div className="text-3xl font-black mb-1">{entry.wpm}</div>
                        <div className="text-sm opacity-75 mb-2">WPM</div>
                        <div className="text-xs opacity-60">{formatDate(entry.created_at)}</div>
                      </div>
                    </div>

                    {/* Full Proof Hash */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs font-mono break-all opacity-50 hover:opacity-100 transition-opacity">
                        <span className="font-medium">Complete Proof:</span> {entry.proof_hash}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Link
            href="/"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">⚡</span>
            Take Challenge
          </Link>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `👑 Check out the TYPE×PROOF Leaderboard! ⚡\n\n${
                leaderboard.length > 0
                  ? `🏆 Current champion: @${leaderboard[0].username} with ${leaderboard[0].wpm} WPM!`
                  : "Be the first to set a cryptographically verified typing record!"
              }\n\n🔐 Every speed is verified with Zero-Knowledge Proofs!\n\n🎯 Think you can type faster?\n\n#ZKProof #TypingChallenge #Web3Gaming #Leaderboard`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🐦</span>
            Share Leaderboard
          </a>
        </div>

        {/* Creator Watermark */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 shadow-2xl">
          <div className="text-center">
            <div className="text-2xl mb-4">⚡</div>
            <div className="text-gray-500 text-xs mb-4 font-mono">ENGINEERED BY</div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700/30">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-white font-medium">rizzgm</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700/30">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">𝕏</span>
                </div>
                <span className="text-white font-medium">RizzDroop23</span>
              </div>

              <a
                href="https://github.com/rizkygm23"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 transform"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⚡</span>
                </div>
                <span className="text-white font-medium">rizkygm23</span>
              </a>
            </div>

            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-2 font-mono">
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
              <span>POWERED BY ZERO-KNOWLEDGE CRYPTOGRAPHY</span>
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
