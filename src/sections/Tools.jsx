import { motion } from 'framer-motion'
import categories from '../data/tools'

const sequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
}

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
}

function Tools() {
  return (
    <section id="tools" className="panel tools-panel" aria-labelledby="tools-title">
      <div className="tools-grid" aria-hidden="true" />
      <span className="tools-ghost" aria-hidden="true">DESIGN / DEVELOP / DEPLOY</span>

      <motion.div
        className="tools-content"
        variants={sequence}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="tools-intro">
          <motion.span className="tools-kicker" variants={reveal}>04 / Kullandığım Araçlar</motion.span>
          <motion.h2 id="tools-title" variants={reveal}>Kullandığım <span>Araçlar</span></motion.h2>
          <motion.p variants={reveal}>
            Projelerimi geliştirirken üretkenliği, sürdürülebilir kod yapısını ve hızlı
            geliştirme sürecini destekleyen modern araçlar kullanıyorum.
          </motion.p>
          <motion.small variants={reveal}>
            Geliştirme, versiyon kontrolü, deployment ve tasarım süreçlerinde
            kullandığım temel araçlar.
          </motion.small>
        </div>

        <motion.div className="tools-categories" variants={sequence}>
          {categories.map((category) => (
            <motion.section className="tool-category" key={category.number} variants={reveal}>
              <header>
                <span>{category.number}</span>
                <h3>{category.title}</h3>
              </header>
              <ul>
                {category.tools.map(([name, Icon]) => (
                  <li key={name}>
                    <Icon aria-hidden="true" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </motion.div>
      </motion.div>

      <span className="panel-index" aria-hidden="true">04 / 06</span>
    </section>
  )
}

export default Tools
