"use client"

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const GradientCursor = () => {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 128)
      cursorY.set(e.clientY - 128)
    }

    window.addEventListener('mousemove', moveCursor)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-50"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 blur-3xl" />
    </motion.div>
  )
}

