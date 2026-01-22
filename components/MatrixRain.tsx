'use client'

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix rain settings - subtle and refined
    const fontSize = 12
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(0)
    const speeds: number[] = Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.2)
    
    // SEO-related characters mixed with binary
    const seoSymbols = '/{}[]<>SEOwww'
    const binary = '01'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + seoSymbols + binary

    // Animation function
    const draw = () => {
      // Create subtle fade with gradient (stronger at top, fades toward bottom)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(2, 6, 23, 0.12)')
      gradient.addColorStop(0.5, 'rgba(2, 6, 23, 0.08)')
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.04)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw characters with refined green/cyan colors
      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize
        
        // Varying opacity for depth (10-15% base)
        const baseOpacity = 0.1 + (i % 3) * 0.015
        const opacity = Math.min(0.15, baseOpacity)
        
        // Refined green/cyan gradient colors
        const colorIntensity = 1 - (y / canvas.height) * 0.3
        const useCyan = Math.random() > 0.7
        const r = useCyan ? Math.floor(6 + colorIntensity * 20) : Math.floor(16 + colorIntensity * 10)
        const g = useCyan ? Math.floor(182 + colorIntensity * 30) : Math.floor(185 - colorIntensity * 20)
        const b = useCyan ? Math.floor(212 - colorIntensity * 10) : Math.floor(129 + colorIntensity * 20)
        
        // Pick character - prefer SEO symbols occasionally
        const charPool = Math.random() > 0.9 ? seoSymbols : chars
        const char = charPool[Math.floor(Math.random() * charPool.length)]
        
        // Draw character with refined color
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        ctx.fillText(char, x, y)

        // Reset drop randomly or when it reaches bottom
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }

        // Move drop down with varying speed
        drops[i] += speeds[i]
      }
    }

    // Slower, more elegant animation
    const interval = setInterval(draw, 80)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="matrixCanvas"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, opacity: 0.6 }}
    />
  )
}
