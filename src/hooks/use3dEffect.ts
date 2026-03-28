'use client'

import { useState, useCallback } from 'react'

export function use3dEffect() {
  const [isHovering, setIsHovering] = useState(false)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (x - centerX) / -10
    setRotate({ x: rotateX, y: rotateY })
  }, [isHovering])

  const onMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setIsHovering(false)
    setRotate({ x: 0, y: 0 })
  }, [])

  const transform = isHovering
    ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.05, 1.05, 1.05)`
    : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'

  return {
    transform,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    transition: 'all 0.2s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
  }
}
