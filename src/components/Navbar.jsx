import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'

const links = [
  { label: 'GitHub', href: 'https://github.com/alevyldrm', icon: FaGithub, tone: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alevyldrm/', icon: FaLinkedinIn, tone: 'linkedin' },
  { label: 'Email', href: 'mailto:hello@example.com', icon: HiOutlineMail, tone: 'email' },
]

function Navbar() {
  const handleBrandClick = (event) => {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="navbar" aria-label="Sosyal bağlantılar">
      <a className="brand" href="#hero" aria-label="Ana sayfa" onClick={handleBrandClick}>
        <span className="brand-signal" aria-hidden="true" />
        <span className="brand-name">ALEV YILDIRIM</span>
      </a>
      <div className="nav-links">
        {links.map(({ label, href, icon: Icon, tone }) => (
          <a className={`nav-link nav-link--${tone}`} key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined} aria-label={label}>
            <span className="nav-link-icon"><Icon aria-hidden="true" /></span>
            <span className="nav-link-label">{label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
