import { useEffect, useMemo, useRef } from 'react'

const DESKTOP_QUERY = '(min-width: 769px) and (pointer: fine)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const SCROLL_SPEED = 1.18
const WHEEL_MULTIPLIER = 1.4
const WHEEL_SNAP_DELAY = 220
const MAX_WHEEL_STEP_RATIO = 0.85
const PERSPECTIVE_VISIBILITY_RANGE = 1.6

function isEditableElement(element) {
  return element?.closest?.('input, textarea, select, button, a, [contenteditable="true"]')
}

function getNormalizedWheelDelta(event) {
  const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
    ? event.deltaY
    : event.deltaX

  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return dominantDelta * 16
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return dominantDelta * window.innerHeight

  return dominantDelta
}

function resetPerspectiveVisual(visual) {
  visual.style.removeProperty('transform')
  visual.style.removeProperty('opacity')
  visual.style.removeProperty('transform-origin')
  visual.style.removeProperty('--perspective-intensity')
  visual.style.removeProperty('--perspective-angle')
  delete visual.dataset.perspectiveActive
}

function ScrollContainer({ children }) {
  const stageRef = useRef(null)
  const trackRef = useRef(null)
  const panels = useMemo(() => Array.isArray(children) ? children : [children], [children])

  useEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return undefined

    const desktopQuery = window.matchMedia(DESKTOP_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let animationFrameId = null
    let wheelSnapTimeoutId = null
    let needsMeasurement = true
    let stageTop = 0
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight
    let panelOffsets = []
    let maxHorizontalScroll = 0
    let perspectiveEntries = []

    const measureLayout = () => {
      const panelElements = Array.from(track.children)
      stageTop = stage.offsetTop
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      panelOffsets = panelElements.map((panel) => panel.offsetLeft)
      maxHorizontalScroll = panelOffsets.at(-1) ?? 0
      perspectiveEntries = panelElements.flatMap((panel) => {
        const visual = panel.querySelector('[data-perspective="true"]')
        return visual ? [{ panel, visual }] : []
      })
      needsMeasurement = false
    }

    const getVirtualLeft = () => Math.max(
      0,
      Math.min(maxHorizontalScroll, (window.scrollY - stageTop) * SCROLL_SPEED),
    )

    const getNearestPanelIndex = (virtualLeft = getVirtualLeft()) => {
      if (panelOffsets.length === 0) return 0

      return panelOffsets.reduce((nearestIndex, offset, index) => (
        Math.abs(offset - virtualLeft) < Math.abs(panelOffsets[nearestIndex] - virtualLeft)
          ? index
          : nearestIndex
      ), 0)
    }

    const clearPerspective = () => {
      perspectiveEntries.forEach(({ visual }) => resetPerspectiveVisual(visual))
    }

    const updatePerspective = (virtualLeft) => {
      if (reducedMotionQuery.matches) {
        clearPerspective()
        return
      }

      const viewportCenter = virtualLeft + viewportWidth / 2

      perspectiveEntries.forEach(({ panel, visual }) => {
        const panelCenter = panel.offsetLeft + panel.offsetWidth / 2
        const distance = panelCenter - viewportCenter
        const progress = Math.max(-1, Math.min(1, distance / viewportWidth))

        if (Math.abs(distance) > viewportWidth * PERSPECTIVE_VISIBILITY_RANGE) {
          if (visual.dataset.perspectiveActive) resetPerspectiveVisual(visual)
          return
        }

        const easedProgress = Math.sign(progress) * Math.pow(Math.abs(progress), 0.78)
        const distanceRatio = Math.abs(easedProgress)
        const transformOrigin = progress > 0.02
          ? 'left center'
          : progress < -0.02
            ? 'right center'
            : 'center center'

        visual.style.transform = `perspective(850px) translate3d(${easedProgress * -28}px, 0, ${distanceRatio * -150}px) rotateY(${easedProgress * -16}deg) scale(${1 - distanceRatio * 0.07})`
        visual.style.opacity = String(1 - distanceRatio * 0.1)
        visual.style.transformOrigin = transformOrigin
        visual.style.setProperty('--perspective-intensity', String(distanceRatio))
        visual.style.setProperty('--perspective-angle', progress > 0 ? '90deg' : '270deg')
        visual.dataset.perspectiveActive = 'true'
      })
    }

    const updateLayout = () => {
      animationFrameId = null
      if (needsMeasurement) measureLayout()

      if (!desktopQuery.matches) {
        stage.style.height = 'auto'
        track.style.transform = 'none'
        clearPerspective()
        return
      }

      const virtualLeft = getVirtualLeft()
      stage.style.height = `${viewportHeight + maxHorizontalScroll / SCROLL_SPEED}px`
      track.style.transform = `translate3d(${-virtualLeft}px, 0, 0)`
      updatePerspective(virtualLeft)
    }

    const scheduleUpdate = () => {
      if (animationFrameId !== null) return
      animationFrameId = window.requestAnimationFrame(updateLayout)
    }

    const scheduleMeasurement = () => {
      needsMeasurement = true
      scheduleUpdate()
    }

    const scrollToPanel = (panelIndex) => {
      if (needsMeasurement) measureLayout()
      const nextIndex = Math.max(0, Math.min(panelOffsets.length - 1, panelIndex))
      const targetTop = stageTop + (panelOffsets[nextIndex] ?? 0) / SCROLL_SPEED
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }

    const snapToNearestPanel = () => {
      wheelSnapTimeoutId = null
      if (desktopQuery.matches) scrollToPanel(getNearestPanelIndex())
    }

    const handleWheel = (event) => {
      if (!desktopQuery.matches || event.ctrlKey) return
      if (event.target?.closest?.('.portfolio-assistant')) return

      event.preventDefault()
      if (wheelSnapTimeoutId !== null) window.clearTimeout(wheelSnapTimeoutId)

      const maxWheelStep = viewportWidth * MAX_WHEEL_STEP_RATIO
      const wheelDistance = getNormalizedWheelDelta(event) * WHEEL_MULTIPLIER
      const scrollAmount = Math.max(-maxWheelStep, Math.min(maxWheelStep, wheelDistance))
      const targetVirtualLeft = Math.max(0, Math.min(maxHorizontalScroll, getVirtualLeft() + scrollAmount))

      window.scrollTo({
        top: stageTop + targetVirtualLeft / SCROLL_SPEED,
        behavior: 'auto',
      })

      wheelSnapTimeoutId = window.setTimeout(snapToNearestPanel, WHEEL_SNAP_DELAY)
    }

    const handleKeyDown = (event) => {
      if (!desktopQuery.matches || isEditableElement(event.target)) return
      const currentIndex = getNearestPanelIndex()

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        scrollToPanel(currentIndex + 1)
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        scrollToPanel(currentIndex - 1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        scrollToPanel(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        scrollToPanel(panels.length - 1)
      }
    }

    updateLayout()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', scheduleMeasurement)
    window.addEventListener('keydown', handleKeyDown)
    desktopQuery.addEventListener('change', scheduleMeasurement)
    reducedMotionQuery.addEventListener('change', scheduleUpdate)

    const resizeObserver = new ResizeObserver(scheduleMeasurement)
    resizeObserver.observe(track)

    return () => {
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
      if (wheelSnapTimeoutId !== null) window.clearTimeout(wheelSnapTimeoutId)
      clearPerspective()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', scheduleMeasurement)
      window.removeEventListener('keydown', handleKeyDown)
      desktopQuery.removeEventListener('change', scheduleMeasurement)
      reducedMotionQuery.removeEventListener('change', scheduleUpdate)
    }
  }, [panels.length])

  return (
    <div className="scroll-stage" ref={stageRef} style={{ '--panel-count': panels.length }}>
      <div className="scroll-sticky">
        <main ref={trackRef} className="horizontal-track" aria-label="Portfolio bölümleri">
          {panels}
        </main>
      </div>
    </div>
  )
}

export default ScrollContainer
