"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

function AddSentenceForm({ username, onAddSuccess }: { username: string, onAddSuccess?: () => void }) {
  const [kalimat, setKalimat] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    if (!kalimat.trim()) {
      setMessage("Kalimat wajib diisi!")
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from("kalimat")
      .insert([{ username, kalimat }])
    if (error) {
      setMessage("❌ Failed to add: " + error.message)
    } else {
      setMessage("✅ Funfact Added")
      setKalimat("")
      onAddSuccess?.()
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 mt-6 space-y-4"
    >
      <h2 className="text-base font-bold text-cyan-400 text-center mb-1">Drop Your Knowledge</h2>
      <div>
        <label className="text-gray-200 font-medium mb-1 block">Username</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
          value={username}
          readOnly
        />
      </div>
      <div>
        <label className="text-gray-200 font-medium mb-1 block">About Succinct</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white min-h-[60px] focus:ring-2 focus:ring-purple-500 outline-none"
          value={kalimat}
          onChange={e => setKalimat(e.target.value)}
          placeholder="Write a fun fact or interesting sentence about Succinct!"
          maxLength={150}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-2 rounded-xl mt-2 shadow hover:from-cyan-400 hover:to-purple-500 transition-all duration-200"
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Kirim Funfact"}
      </button>
      {message && <div className="text-center mt-2 text-sm text-emerald-400">{message}</div>}
    </form>
  )
}

function TypingChallengeComponent({ refreshKey }: { refreshKey?: number }) {
  const searchParams = useSearchParams()
  const username = searchParams.get("username") || ""

  const [sentences, setSentences] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [typed, setTyped] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [scoreProof, setScoreProof] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isProving, setIsProving] = useState(false)
  const [savedToDatabase, setSavedToDatabase] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)

  useEffect(() => {
    const fetchSentences = async () => {
      setLoading(true)
      let { data, error } = await supabase
        .from("kalimat")
        .select("kalimat")
      if (!error && data && data.length > 0) {
        const shuffled = data.map(d => d.kalimat).sort(() => 0.5 - Math.random())
        setSentences(shuffled.slice(0, 3))
      } else {
        setSentences([
          "Succinct's zkVM proves computations in milliseconds.",
        ])
      }
      setLoading(false)
    }
    fetchSentences()
  }, [refreshKey])

  const targetSentence = sentences[currentIndex] || ""

  const saveToSupabase = async (username: string, proofHash: string, wpm: number) => {
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from("proofType")
        .select("*")
        .eq("username", username)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        return false
      }

      if (existingData) {
        if (wpm > existingData.wpm) {
          const { error } = await supabase
            .from("proofType")
            .update({
              proof_hash: proofHash,
              wpm: wpm,
              created_at: new Date().toISOString(),
            })
            .eq("username", username)

          if (error) return false
          return true
        } else {
          return true
        }
      } else {
        const { error } = await supabase.from("proofType").insert([
          {
            username: username,
            proof_hash: proofHash,
            wpm: wpm,
            created_at: new Date().toISOString(),
          },
        ])
        if (error) return false
        return true
      }
    } catch {
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (!startTime) setStartTime(Date.now())
    setTyped(value)

    if (value === targetSentence) {
      if (currentIndex === sentences.length - 1) {
        setEndTime(Date.now())
        setIsTypingComplete(true)
        setShowFinalModal(true)
        setCurrentIndex(currentIndex + 1)
      } else {
        setTyped("")
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  const getWPM = () => {
    if (!startTime || !endTime) return 0
    const minutes = (endTime - startTime) / 1000 / 60
    const totalChars = sentences.join(" ").length
    return Math.round(totalChars / 5 / minutes)
  }

  const getCharClass = (index: number) => {
    if (!typed[index]) return "text-gray-500"
    return typed[index] === targetSentence[index]
      ? "text-emerald-400 bg-emerald-400/20 rounded-sm"
      : "text-red-400 bg-red-400/20 rounded-sm"
  }

  const handleProve = async () => {
    if (!startTime || !endTime || !username.trim()) return
    setIsProving(true)

    const payload = {
      username: username,
      totalTyped: sentences.join(" ").length,
      wpm: getWPM(),
      timestamp: new Date().toISOString(),
    }

    try {
      const res = await fetch("/api/prove-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Proof failed")

      const data = await res.json()
      const fullProofHash = data.proof_hash || "generated_hash"
      setScoreProof(fullProofHash)

      const saveSuccess = await saveToSupabase(username, fullProofHash, getWPM())
      if (saveSuccess) {
        setSavedToDatabase(true)
      }
    } catch {
      setScoreProof("Failed to generate proof")
    } finally {
      setIsProving(false)
    }
  }

  const resetGame = () => {
    setTyped("")
    setCurrentIndex(0)
    setStartTime(null)
    setEndTime(null)
    setScoreProof("")
    setIsTypingComplete(false)
    setIsProving(false)
    setSavedToDatabase(false)
    setShowFinalModal(false)
  }

  const getProgressPercentage = () => {
    return ((currentIndex ) / sentences.length) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl mb-6 shadow-2xl shadow-cyan-500/25">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Loading Challenge...
          </h1>
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl mb-6 shadow-2xl shadow-cyan-500/25">
            <span className="text-2xl">⚡</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              CHALLENGE ACTIVE
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400"></div>
            <span className="text-cyan-400 font-mono text-sm">Proof your typing of Knowledge</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400"></div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 text-white font-medium py-2 px-4 rounded-xl hover:border-gray-600 transition-all duration-300 flex items-center gap-2"
            >
              <span>←</span>
              Home
            </Link>
            <Link
              href="/leaderboard"
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 text-white font-medium py-2 px-4 rounded-xl hover:border-purple-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <span>👑</span>
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar: Progress, Stats, Reset, Form */}
          <div className="space-y-6 flex flex-col">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span className="text-cyan-400">▶</span>
                  Progress
                </h3>
                <span className="text-gray-400 text-sm font-mono">
                  {currentIndex + 1}/{sentences.length}
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.round(getProgressPercentage())}%</div>
                <div className="text-gray-400 text-sm">Complete</div>
              </div>
            </div>

            {startTime && (
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  Live Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Time</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {endTime
                        ? `${((endTime - startTime) / 1000).toFixed(1)}s`
                        : `${((Date.now() - startTime) / 1000).toFixed(1)}s`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Accuracy</span>
                    <span className="text-emerald-400 font-bold">
                      {typed.length > 0
                        ? `${Math.round((typed.split("").filter((char, i) => char === targetSentence[i]).length / typed.length) * 100)}%`
                        : "100%"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">WPM</span>
                    <span className="text-purple-400 font-bold text-xl">{isTypingComplete ? getWPM() : "---"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Characters</span>
                    <span className="text-pink-400 font-mono">
                      {typed.length}/{targetSentence.length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Reset & Form */}
            <div>
              <button
                onClick={resetGame}
                className="w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 text-white font-bold py-4 px-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 mb-2"
              >
                <span className="text-xl">🔄</span>
                Reset Challenge
              </button>
              <AddSentenceForm username={username} onAddSuccess={resetGame} />
            </div>
          </div>

          {/* Main Typing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Typing Interface */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span className="text-purple-400">◆</span>
                  Type This Sentence
                </h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-400 text-xs">Correct</span>
                  <div className="w-2 h-2 bg-red-400 rounded-full ml-4"></div>
                  <span className="text-gray-400 text-xs">Incorrect</span>
                </div>
              </div>

              <div className="relative bg-gray-900/80 border border-gray-700/50 rounded-2xl p-8 min-h-[200px]">
                <div className="absolute inset-8 text-left text-xl font-mono whitespace-pre-wrap break-words pointer-events-none leading-relaxed">
                  {targetSentence.split("").map((char, i) => (
                    <span key={i} className={`${getCharClass(i)} px-0.5`}>
                      {char}
                    </span>
                  ))}
                </div>
                <textarea
                  rows={6}
                  className="absolute inset-8 w-full text-left text-xl text-transparent bg-transparent outline-none resize-none font-mono caret-cyan-400 leading-relaxed"
                  value={typed}
                  onChange={handleChange}
                  spellCheck={false}
                  autoFocus
                  placeholder=""
                />
                
              </div>
              
            </div>

            {/* Challenge Info */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-yellow-400">⚠</span>
                Challenge Rules
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Type each sentence exactly</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Speed and accuracy matter</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-300">Complete all the sentences</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">Generate ZK proof at the end</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Watermark */}
        <div className="mt-12 bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-4 shadow-2xl">
          <div className="text-center">
            <div className="text-gray-500 text-xs mb-3 font-mono">CREATED BY</div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/30">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-white text-sm font-medium">rizzgm</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/30">
                <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">𝕏</span>
                </div>
                <span className="text-white text-sm font-medium">RizzDroop23</span>
              </div>
              <a
                href="https://github.com/rizkygm23"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 transform"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⚡</span>
                </div>
                <span className="text-white text-sm font-medium">rizkygm23</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Final Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4">Challenge Complete!</h2>
            <p className="text-gray-300 mb-8">
              Incredible typing speed of <span className="font-bold text-cyan-400 text-2xl">{getWPM()} WPM</span>!
            </p>

            <button
              onClick={handleProve}
              disabled={isProving}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
            >
              {isProving ? "🔮 Generating Proof..." : "🔮 Generate ZK Proof"}
            </button>

            {savedToDatabase && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-3 mb-4">
                <div className="text-sm font-medium text-emerald-400 flex items-center justify-center gap-2">
                  <span>✓</span>
                  Saved to leaderboard!
                </div>
              </div>
            )}

            {scoreProof && (
              <>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `⚡ Just crushed the TYPE×PROOF challenge! 🚀\n\n🏆 Speed: ${getWPM()} WPM\n🔐 Cryptographically Verified with Zero-Knowledge Proof!\n\n✨ Proof Hash: ${scoreProof.substring(0, 16)}...\n\n🎯 Think you can type faster? Try the ZK typing challenge!\n\n#ZKProof #TypingChallenge #Web3Gaming #ZeroKnowledge`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 mb-4 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🐦</span>
                  Share Achievement
                </a>

                <Link
                  href="/leaderboard"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 mb-4 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">👑</span>
                  View Leaderboard
                </Link>

                <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 mb-4">
                  <div className="text-xs font-mono break-all text-cyan-400">
                    <span className="font-medium text-white">Proof Hash:</span>
                    <br />
                    {scoreProof}
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setShowFinalModal(false)}
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChallengePage() {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <Suspense fallback={null}>
      <TypingChallengeComponent refreshKey={refreshKey} />
    </Suspense>
  )
}
