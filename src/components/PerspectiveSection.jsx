import { lazy, Suspense } from 'react'

const Ferrofluid = lazy(() => import('./Ferrofluid'))
const FERROFLUID_COLORS = ['#385328', '#789e47', '#b8f36b']

function PerspectiveSection({ index, totalSections, disablePerspective = false, children }) {
  return (
    <div
      className="perspective-section panel"
      data-section-index={index}
      data-section-total={totalSections}
    >
      <div
        className="perspective-visual"
        data-perspective={disablePerspective ? 'false' : 'true'}
      >
        <div className="perspective-content">{children}</div>
        <Suspense fallback={null}>
          <Ferrofluid
            className="section-ferrofluid"
            colors={FERROFLUID_COLORS}
            speed={0.08}
            scale={1.9}
            turbulence={0.32}
            fluidity={0.24}
            rimWidth={0.14}
            sharpness={1.35}
            shimmer={0.06}
            glow={1.25}
            opacity={0.58}
            flowDirection="right"
            mouseStrength={0.55}
            mouseRadius={0.28}
            mouseDampening={0.22}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default PerspectiveSection
