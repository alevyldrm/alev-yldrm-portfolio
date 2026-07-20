import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import categories from '../data/skills'

const ORBIT_DURATION_MS = 42000
const ACTIVE_TARGET_ANGLE = -90
const ORBIT_STEP_ANGLE = 360 / categories.length

const sequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
}

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
}

function Skills() {
  const sectionRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [orbitBaseAngle, setOrbitBaseAngle] = useState(null)
  const orbitStartedAt = useRef(performance.now())
  const isInView = useInView(sectionRef, { amount: 0.12 })
  const selectedCategory = selectedIndex === null ? null : categories[selectedIndex]

  const selectCategory = (index) => {
    setOrbitBaseAngle((currentBaseAngle) => {
      const elapsedAngle = ((performance.now() - orbitStartedAt.current) / ORBIT_DURATION_MS) * 360
      const startingAngle = currentBaseAngle ?? elapsedAngle
      const rawTargetAngle = ACTIVE_TARGET_ANGLE - index * ORBIT_STEP_ANGLE
      const clockwiseTurns = Math.max(0, Math.ceil((startingAngle - rawTargetAngle) / 360))

      return rawTargetAngle + clockwiseTurns * 360
    })
    setSelectedIndex(index)
  }

  return (
    <section ref={sectionRef} id="skills" className={`panel skills-panel${isInView ? ' is-visible' : ''}`} aria-labelledby="skills-title">
      <div className="skills-grid" aria-hidden="true" />
      <span className="skills-ghost" aria-hidden="true">INTERFACES</span>

      <motion.div className="skills-content" variants={sequence} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <div className="skills-intro">
          <motion.span className="skills-kicker" variants={reveal}>03 / Teknik Yetenekler</motion.span>
          <motion.h2 id="skills-title" variants={reveal}>Teknik <span>Yetenekler</span></motion.h2>
          <motion.p variants={reveal}>Modern, responsive ve kullanıcı odaklı arayüzler geliştirirken React ekosistemi, state yönetimi ve API entegrasyonları üzerine çalışıyorum.</motion.p>
          <motion.span className="skills-note" variants={reveal} aria-hidden="true">Bir kategori seçin — keşfetmek için</motion.span>
        </div>

        <motion.div className={`skills-orbit${selectedCategory ? ' has-selection' : ''}`} variants={reveal}>
          <div className="skills-orbit-rings" aria-hidden="true"><i /><i /><i /></div>

          <div className="skills-orbit-center" aria-live="polite">
            <AnimatePresence mode="wait">
              {selectedCategory ? (
                <motion.div key={selectedCategory.number} initial={{ opacity: 0, scale: .94, filter: 'blur(5px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}>
                  <span>{selectedCategory.number} / {selectedCategory.title}</span>
                  <h3>{selectedCategory.title}</h3>
                  <ul>{selectedCategory.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                </motion.div>
              ) : (
                <motion.div className="orbit-prompt" key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span>Technical spectrum</span>
                  <i className="orbit-core-mark" aria-hidden="true"><b /></i>
                  <strong>Explore</strong>
                  <small>Bir rozet seçin</small>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {categories.map((category, index) => (
            <button
              className={`skill-orbit-badge${selectedIndex === index ? ' is-selected' : ''}`}
              style={{
                '--orbit-delay': `${index * -6}s`,
                '--orbit-angle': selectedIndex === null
                  ? undefined
                  : `${orbitBaseAngle + index * ORBIT_STEP_ANGLE}deg`,
                '--mobile-order': index,
              }}
              type="button"
              key={category.number}
              onClick={() => selectCategory(index)}
              aria-pressed={selectedIndex === index}
            >
              <span>{category.number}</span><strong>{category.title}</strong>
            </button>
          ))}
        </motion.div>
      </motion.div>

      <span className="panel-index" aria-hidden="true">03 / 06</span>
    </section>
  )
}

export default Skills
