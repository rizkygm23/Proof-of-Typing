"use client"

import { useEffect, useRef } from "react"

interface TypingSoundsProps {
  onKeyPress?: () => void
  onCorrect?: () => void
  onError?: () => void
  onComplete?: () => void
}

export function TypingSounds({ onKeyPress, onCorrect, onError, onComplete }: TypingSoundsProps) {
  const keyPressAudioRef = useRef<HTMLAudioElement | null>(null)
  const correctAudioRef = useRef<HTMLAudioElement | null>(null)
  const errorAudioRef = useRef<HTMLAudioElement | null>(null)
  const completeAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio elements for different sound effects
    keyPressAudioRef.current = new Audio()
    correctAudioRef.current = new Audio()
    errorAudioRef.current = new Audio()
    completeAudioRef.current = new Audio()

    // Set audio sources (you can replace with actual sound files)
    keyPressAudioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    correctAudioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    errorAudioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    completeAudioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"

    // Set volume levels
    if (keyPressAudioRef.current) keyPressAudioRef.current.volume = 0.3
    if (correctAudioRef.current) correctAudioRef.current.volume = 0.4
    if (errorAudioRef.current) errorAudioRef.current.volume = 0.5
    if (completeAudioRef.current) completeAudioRef.current.volume = 0.6

    return () => {
      keyPressAudioRef.current = null
      correctAudioRef.current = null
      errorAudioRef.current = null
      completeAudioRef.current = null
    }
  }, [])

  const playKeyPress = () => {
    if (keyPressAudioRef.current) {
      keyPressAudioRef.current.currentTime = 0
      keyPressAudioRef.current.play().catch(() => {})
    }
    onKeyPress?.()
  }

  const playCorrect = () => {
    if (correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0
      correctAudioRef.current.play().catch(() => {})
    }
    onCorrect?.()
  }

  const playError = () => {
    if (errorAudioRef.current) {
      errorAudioRef.current.currentTime = 0
      errorAudioRef.current.play().catch(() => {})
    }
    onError?.()
  }

  const playComplete = () => {
    if (completeAudioRef.current) {
      completeAudioRef.current.currentTime = 0
      completeAudioRef.current.play().catch(() => {})
    }
    onComplete?.()
  }

  return {
    playKeyPress,
    playCorrect,
    playError,
    playComplete,
  }
}
