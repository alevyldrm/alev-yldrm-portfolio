import PortfolioAppreciation from '../components/PortfolioAppreciation'

const CONTACT_EMAIL = 'hello@example.com'

function Footer() {
  const handleBackToStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="panel footer-panel" aria-labelledby="footer-title">
      <div className="footer-grid" aria-hidden="true" />
      <span className="footer-ghost" aria-hidden="true">LET&apos;S BUILD</span>

      <div className="footer-content">
        <div className="footer-main">
          <span className="footer-kicker">06 / İletişim</span>
          <h2 id="footer-title">Birlikte <span>üretelim.</span></h2>
          <p>Yeni frontend fırsatlarına, iş birliklerine ve yaratıcı projelere açığım.</p>

          <div className="footer-identity">
            <strong>Alev Yıldırım</strong>
            <span>Frontend Developer</span>
            <p>React ve modern web teknolojileriyle kullanıcı odaklı dijital deneyimler geliştiriyorum.</p>
          </div>

          <PortfolioAppreciation />
        </div>

        <form
          className="contact-form"
          action={`mailto:${CONTACT_EMAIL}`}
          method="post"
          encType="text/plain"
        >
          <div className="contact-form-heading">
            <span>Yeni bir proje mi var?</span>
            <strong>Mesaj bırakabilirsiniz</strong>
          </div>

          <label>
            <span>01 / Adınız</span>
            <input type="text" name="name" autoComplete="name" placeholder="Adınızı yazın" required />
          </label>

          <label>
            <span>02 / Email</span>
            <input type="email" name="email" autoComplete="email" placeholder="email@adresiniz.com" required />
          </label>

          <label>
            <span>03 / Mesaj</span>
            <textarea name="message" rows="3" placeholder="Projenizden kısaca bahsedin" required />
          </label>

          <button type="submit"><span>Mesajı gönder</span><i aria-hidden="true">↗</i></button>
        </form>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Alev Yıldırım</span>
        <span>Ankara, Türkiye</span>
        <button type="button" onClick={handleBackToStart}>Başa dön <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  )
}

export default Footer
