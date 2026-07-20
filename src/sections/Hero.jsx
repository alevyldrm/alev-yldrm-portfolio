import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HiPause, HiPlay } from 'react-icons/hi2'
import ScrollIndicator from '../components/ScrollIndicator'

function VinylRecord() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const handleToggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <aside className="vinyl-feature" aria-label="Music and vinyl record">
      <div className={`vinyl-stage${isPlaying ? ' is-playing' : ''}`}>
        <div className="vinyl-sleeve" aria-hidden="true">
          <span>CREATIVE<br />FREQUENCY</span>
          <small>AY / 001</small>
        </div>
        <div className={`vinyl-record${isPlaying ? ' is-playing' : ''}`} aria-hidden="true">
          <div className="vinyl-label">
            <span>SIDE A</span>
            <strong>CREATIVE</strong>
            <small>FREQUENCY / AY-001</small>
            <i aria-hidden="true" />
          </div>
        </div>
        <span className="vinyl-arm" aria-hidden="true"><i /></span>
        <span className="vinyl-shadow" aria-hidden="true" />
      </div>

      <div className="vinyl-copy">
        <span>Now in the studio</span>
        <strong>Funk &amp; Breakbeat</strong>
        <small>AlexGuz · Selected mood 001</small>
      </div>

      <div className="vinyl-controls" aria-label="Müzik kontrolleri">
        <button
          className={`vinyl-control${isPlaying ? ' is-playing' : ''}`}
          type="button"
          onClick={handleToggle}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? 'Müziği duraklat' : 'Müziği oynat'}
          title={isPlaying ? 'Duraklat' : 'Oynat'}
        >
          {isPlaying ? <HiPause aria-hidden="true" /> : <HiPlay aria-hidden="true" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <audio
        ref={audioRef}
        src="/audio/alexguz-funk-breakbeat.mp3"
        preload="none"
        onEnded={() => setIsPlaying(false)}
      />
    </aside>
  )
}

function Hero() {
  return (
    <section id="hero" className="panel hero-panel">
      <div className="hero-layout">
        <motion.div className="hero-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="role-tag"><i />Frontend Developer</span>
          <h1>Modern web deneyimleri <em>geliştiriyorum.</em></h1>
          <p>React ve JavaScript ekosisteminde kullanıcı odaklı, akıcı ve modern arayüzler geliştiriyorum.</p>
          <ScrollIndicator />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.18 }}>
          <VinylRecord />
        </motion.div>
      </div>
      <span className="panel-index" aria-hidden="true">01 / 06</span>
    </section>
  )
}

export default Hero
