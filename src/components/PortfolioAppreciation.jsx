import { useEffect, useRef, useState } from 'react'

function PixelHeart({ isPulsing }) {
  return (
    <svg
      className={`appreciation-heart${isPulsing ? ' is-pulsing' : ''}`}
      viewBox="0 0 18 16"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d="M2 1h5v2h4V1h5v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2V9H0V3h2z" />
      <path className="appreciation-heart-cutout" d="M3 3h3v2h6V3h3v6h-2v2h-2v2H7v-2H5V9H3z" />
    </svg>
  )
}

function SmileMark() {
  return <i className="appreciation-smile" aria-hidden="true"><b /></i>
}

function PortfolioAppreciation() {
  const [pulseId, setPulseId] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    return () => window.clearTimeout(toastTimerRef.current)
  }, [])

  const handleAppreciation = () => {
    setPulseId((current) => current + 1)
    setShowToast(true)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setShowToast(false), 2800)
  }

  return (
    <section className="portfolio-appreciation" aria-label="Portfolio beğenisi">
      <button
        className="appreciation-button"
        type="button"
        onClick={handleAppreciation}
        aria-label="Portfolyoyu beğen"
        title="Portfolyoyu beğen"
      >
        <PixelHeart key={pulseId} isPulsing={pulseId > 0} />
      </button>

      <div className={`appreciation-toast${showToast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        <span>Beğeni için teşekkürler!</span>
        <SmileMark />
      </div>
    </section>
  )
}

export default PortfolioAppreciation
