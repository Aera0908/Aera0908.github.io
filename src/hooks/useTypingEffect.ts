import { useState, useEffect } from 'react'

interface UseTypingEffectProps {
  text: string
  speed?: number
  delay?: number
}

export const useTypingEffect = ({ text, speed = 50, delay = 0 }: UseTypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setIsTyping(true)
    setDisplayedText('')
    
    let interval: ReturnType<typeof setInterval> | null = null
    
    const timer = setTimeout(() => {
      let currentIndex = 0
      interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          setIsTyping(false)
          if (interval) {
            clearInterval(interval)
          }
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [text, speed, delay])

  return { displayedText, isTyping }
}
