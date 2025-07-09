import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MusicPlayer } from "@/components/music-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TYPE×PROOF - ZK Typing Challenge",
  description: "Zero-Knowledge Typing Challenge - Type fast, prove faster!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <MusicPlayer />
      </body>
    </html>
  )
}
