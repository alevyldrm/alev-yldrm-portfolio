import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'

function ScrollIndicator() {
  const indicatorRef = useRef(null)
  const isInView = useInView(indicatorRef, { amount: 0.2 })

  return (
    <div ref={indicatorRef} className="scroll-indicator" aria-hidden="true">
      <span className="scroll-indicator-label">Kaydır ve keşfet</span>
      <span className="scroll-indicator-rail"><i /></span>
      <motion.span
        className="scroll-indicator-icon"
        animate={isInView ? { x: [0, 6, 0] } : { x: 0 }}
        transition={isInView ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      >
        <HiArrowRight />
      </motion.span>
    </div>
  )
}

export default ScrollIndicator
