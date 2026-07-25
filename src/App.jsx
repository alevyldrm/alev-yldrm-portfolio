import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import MagneticLoader from './components/MagneticLoader'
import PerspectiveSection from './components/PerspectiveSection'
import ScrollContainer from './components/ScrollContainer'
import PortfolioAssistant from './components/PortfolioAssistant'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Tools from './sections/Tools'
import Projects from './sections/Projects'
import Footer from './sections/Footer'

const sections = [Hero, About, Skills, Tools, Projects, Footer]

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const finishLoading = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setIsLoading(false)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isLoading && <MagneticLoader key="magnetic-loader" onComplete={finishLoading} />}
      </AnimatePresence>
      <div className={`site-shell${isLoading ? ' site-is-loading' : ''}`} aria-busy={isLoading}>
        <Navbar />
        <ScrollContainer>
          {sections.map((Section, index) => (
            <PerspectiveSection
              key={index}
              index={index}
              totalSections={sections.length}
              disablePerspective={index === 0 || index === sections.length - 1}
            >
              <Section />
            </PerspectiveSection>
          ))}
        </ScrollContainer>
        <PortfolioAssistant />
      </div>
    </>
  )
}

export default App
