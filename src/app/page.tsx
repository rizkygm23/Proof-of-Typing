"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function Home() {
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleStartChallenge = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() !== "") {
      router.push(`/challenge?username=${encodeURIComponent(username)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-8 shadow-2xl shadow-cyan-500/25">
            <span className="text-4xl">⚡</span>
          </div>

          <h1 className="text-2xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TYPE
            </span>
            <span className="text-white mx-4">×</span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PROOF
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400"></div>
            <span className="text-cyan-400 font-mono text-sm tracking-wider">ZERO KNOWLEDGE PROTOCOL</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400"></div>
          </div>

          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Challenge your typing speed with cryptographic verification. Every keystroke matters, every proof is
            immutable.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Challenge Form */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-white">Initialize Challenge</h2>
              </div>

              <form onSubmit={handleStartChallenge} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                    <span className="text-cyan-400">@</span>
                    Twitter Handle
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="your_handle"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-900/80 border border-gray-600/50 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 text-lg font-mono"
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!username.trim()}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
                >
                  <span className="text-2xl">🚀</span>
                  Launch Challenge
                </button>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-cyan-400 font-bold text-lg">WPM</div>
                <div className="text-gray-400 text-sm">Speed Test</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">🔐</div>
                <div className="text-purple-400 font-bold text-lg">ZK</div>
                <div className="text-gray-400 text-sm">Verified</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-pink-400 font-bold text-lg">Rank</div>
                <div className="text-gray-400 text-sm">Compete</div>
              </div>
            </div>
          </div>

          {/* Right Side - Preview & Info */}
          <div className="space-y-8">
            {/* Typing Preview */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">▶</span>
                  Live Preview
                </h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm border border-gray-700/50">
                <div className="text-gray-500 mb-2">$ typing_challenge.exe</div>
                <div className="text-white leading-relaxed">
                  <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">S</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">u</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">c</span>
                  <span className="bg-red-500/20 text-red-400 px-1 rounded">x</span>
                  <span className="text-gray-500">inct's zkVM proves...</span>
                  <span className="bg-cyan-400 w-2 h-5 inline-block ml-1 animate-pulse"></span>
                </div>
                <div className="text-cyan-400 text-xs mt-4 flex items-center gap-2">
                  <span>●</span>
                  <span>Real-time accuracy tracking</span>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-purple-400">◆</span>
                Protocol Flow
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-white font-medium">Type Sentences</div>
                    <div className="text-gray-400 text-sm">Complete all challenges with precision</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <div className="text-white font-medium">Generate Proof</div>
                    <div className="text-gray-400 text-sm">ZK verification of your performance</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <div className="text-white font-medium">Claim Victory</div>
                    <div className="text-gray-400 text-sm">Share your cryptographic achievement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-16 mb-12">
          <Link
            href="/leaderboard"
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-2xl">👑</span>
            View Leaderboard
          </Link>
        </div>

        {/* Creator Watermark */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-6 shadow-2xl">
          <div className="text-center">
            <div className="text-3xl mb-4">⚡</div>
            <div className="text-gray-400 text-sm mb-4 font-mono">CRAFTED BY</div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-white font-medium">rizzgm</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700/30 hover:border-cyan-500/50 transition-all duration-300">
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
