import { motion } from 'framer-motion'

const sequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
}

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

const profile = [
  ['Odak', 'React ve modern frontend geliştirme'],
  ['Yaklaşım', 'Responsive, temiz ve kullanıcı odaklı arayüzler'],
  ['Şu an', 'Yeni frontend fırsatlarına açığım'],
]

function About() {
  return (
    <section id="about" className="panel about-panel" aria-labelledby="about-title">
      <div className="about-grid" aria-hidden="true" />
      <span className="about-monogram" aria-hidden="true">AY</span>

      <motion.div
        className="about-content"
        variants={sequence}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.38 }}
      >
        <motion.div className="about-kicker" variants={reveal}>
          <span>02 / Hakkımda</span>
          <i aria-hidden="true" />
          <span>Frontend Developer</span>
        </motion.div>

        <div className="about-layout">
          <motion.div className="about-heading" variants={reveal}>
            <span className="about-coordinate" aria-hidden="true">41.0082° N — 28.9784° E</span>
            <h2 id="about-title">Alev <span>Yıldırım</span></h2>
          </motion.div>

          <div className="about-details">
            <div className="about-copy">
              <motion.p variants={reveal}>
                React odaklı bir Frontend geliştiricisiyim. JavaScript, React, Redux,
                Next.js, HTML ve CSS teknolojileriyle modern, akıcı ve kullanıcı odaklı
                arayüzler geliştirmeye odaklanıyorum.
              </motion.p>
              <motion.p variants={reveal}>
                Öğrenmeyi ve yeni teknolojiler denemeyi seviyorum. Takım çalışmasına
                yatkınım ve bu alanda kendimi sürekli geliştirmeyi hedefliyorum.
              </motion.p>
            </div>

            <motion.dl className="about-profile" variants={sequence}>
              {profile.map(([label, value]) => (
                <motion.div key={label} variants={reveal}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </div>
      </motion.div>

      <span className="panel-index" aria-hidden="true">02 / 06</span>
    </section>
  )
}

export default About
