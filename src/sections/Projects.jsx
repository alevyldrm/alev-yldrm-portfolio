import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
import { HiArrowUpRight } from 'react-icons/hi2'
import projects from '../data/projects'

const sequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
}

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
}

function ProjectMockup({ cover, theme, name, demo }) {
  return (
    <a
      className={`project-mockup project-mockup--${theme}`}
      href={demo}
      target="_blank"
      rel="noreferrer"
      aria-label={`${name} canlı demosunu aç`}
    >
      <div className="mockup-browser" aria-hidden="true">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="browser-address">{theme === 'commerce' ? 'penguin-store' : 'netflix-clone'}</span>
      </div>
      <div className="mockup-stage">
        <img
          className="project-cover"
          src={cover}
          alt={`${name} proje ekran görüntüsü`}
          loading="lazy"
          decoding="async"
        />
      </div>
    </a>
  )
}

function Projects() {
  return (
    <section id="projects" className="panel projects-panel" aria-labelledby="projects-title">
      <div className="projects-grid" aria-hidden="true" />
      <span className="projects-ghost" aria-hidden="true">SELECTED WORK</span>

      <motion.div className="projects-content" variants={sequence} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
        <div className="projects-intro">
          <motion.span className="projects-kicker" variants={reveal}>05 / Projeler</motion.span>
          <motion.h2 id="projects-title" variants={reveal}>Seçili <span>Projeler</span></motion.h2>
          <motion.p variants={reveal}>React ekosistemiyle geliştirdiğim, kullanıcı deneyimi ve modern arayüz yaklaşımına odaklanan seçili projeler.</motion.p>
        </div>

        <motion.div className="project-list" variants={sequence}>
          {projects.map((project) => (
            <motion.article className="project-item" key={project.number} variants={reveal}>
              <ProjectMockup cover={project.cover} theme={project.theme} name={project.name} demo={project.demo} />
              <div className="project-info">
                <header>
                  <span>{project.number}</span>
                  <h3><a href={project.demo} target="_blank" rel="noreferrer">{project.name}</a></h3>
                </header>
                <p>{project.description}</p>
                <ul className="project-features" aria-label="Öne çıkan özellikler">
                  {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <ul className="project-tech" aria-label="Kullanılan teknolojiler">
                  {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                <div className="project-links">
                  <a href={project.demo} target="_blank" rel="noreferrer">Canlı Demo <HiArrowUpRight /></a>
                  <a href={project.github} target="_blank" rel="noreferrer"><FaGithub /> GitHub <HiArrowUpRight /></a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>

      <span className="panel-index" aria-hidden="true">05 / 06</span>
    </section>
  )
}

export default Projects
