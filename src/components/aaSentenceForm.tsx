"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AddSentenceForm() {
  const [username, setUsername] = useState("")
  const [kalimat, setKalimat] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    if (!username.trim() || !kalimat.trim()) {
      setMessage("Username & Kalimat wajib diisi!")
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from("kalimat")
      .insert([{ username, kalimat }])
    if (error) {
      setMessage("❌ Gagal menyimpan: " + error.message)
    } else {
      setMessage("✅ Funfact berhasil disubmit, tunggu moderator approve!")
      setUsername("")
      setKalimat("")
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 mt-12 space-y-4"
    >
      <h2 className="text-xl font-bold text-cyan-400 text-center mb-2">Tambahkan Funfact Baru!</h2>
      <div>
        <label className="text-gray-200 font-medium mb-1 block">Username</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="masukkan username kamu"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="text-gray-200 font-medium mb-1 block">Kalimat Funfact (tentang Succinct/zkVM, dll)</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white min-h-[80px] focus:ring-2 focus:ring-purple-500 outline-none"
          value={kalimat}
          onChange={e => setKalimat(e.target.value)}
          placeholder="Contoh: Succinct's zkVM can prove general computation with zero-knowledge!"
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
