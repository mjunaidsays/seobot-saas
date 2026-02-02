'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import MatrixRain with no SSR
const MatrixRain = dynamic(() => import('./MatrixRain'), { 
  ssr: false,
  loading: () => null 
})

export default function DelayedMatrixRain() {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    // Delay MatrixRain by 3 seconds to reduce initial page load impact
    const timer = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(timer)
  }, [])
  
  return show ? <MatrixRain /> : null
}
