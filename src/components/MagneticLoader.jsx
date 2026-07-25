import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function MagneticLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const isComplete = progress === 100

  useEffect(() => {
    document.body.classList.add('is-loading')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 420 : 2600
    const start = performance.now()
    let frameId
    let completionTimer
    let lastVisibleProgress = -1

    const updateProgress = (now) => {
      const elapsed = Math.min(1, (now - start) / duration)
      const easedProgress = 1 - Math.pow(1 - elapsed, 2)
      const visibleProgress = elapsed < 1
        ? Math.min(99, Math.floor(easedProgress * 100))
        : 100

      if (visibleProgress !== lastVisibleProgress) {
        lastVisibleProgress = visibleProgress
        setProgress(visibleProgress)
      }

      if (elapsed < 1) frameId = window.requestAnimationFrame(updateProgress)
      else completionTimer = window.setTimeout(onComplete, reducedMotion ? 80 : 140)
    }

    frameId = window.requestAnimationFrame(updateProgress)
    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(completionTimer)
      document.body.classList.remove('is-loading')
    }
  }, [onComplete])

  return (
    <motion.div
      className={`magnetic-loader${isComplete ? ' is-complete' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Portfolio hazırlanıyor, yüzde ${progress}`}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.01 }}
      transition={{ duration: .72, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="magnetic-ambient" aria-hidden="true" />
      <div className="magnetic-grain" aria-hidden="true" />

      <div className="magnetic-progress">
        <div className="magnetic-labels"><span>Yükleniyor...</span><strong>{String(progress).padStart(3, '0')}</strong></div>
        <div className="magnetic-line" aria-hidden="true"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
      </div>
    </motion.div>
  )
}

export default MagneticLoader
