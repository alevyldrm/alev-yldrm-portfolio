import { useState } from 'react'
import PortfolioAppreciation from '../components/PortfolioAppreciation'

const FORM_NAME = 'contact'

function Footer() {
  const [submitStatus, setSubmitStatus] = useState('idle')

  const handleBackToStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    setSubmitStatus('submitting')

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })

      if (!response.ok) throw new Error('Form submission failed')

      form.reset()
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    }
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
          name={FORM_NAME}
          method="POST"
          action="/"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          encType="application/x-www-form-urlencoded"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value={FORM_NAME} />
          <p className="contact-form-honeypot" aria-hidden="true">
            <label htmlFor="contact-bot-field">
              Bu alanı boş bırakın
              <input id="contact-bot-field" name="bot-field" tabIndex="-1" autoComplete="off" />
            </label>
          </p>

          <div className="contact-form-heading">
            <span>Yeni bir proje mi var?</span>
            <strong>Mesaj bırakabilirsiniz</strong>
          </div>

          <label htmlFor="contact-name">
            <span>01 / Adınız</span>
            <input id="contact-name" type="text" name="name" autoComplete="name" placeholder="Adınızı yazın" required />
          </label>

          <label htmlFor="contact-email">
            <span>02 / Email</span>
            <input id="contact-email" type="email" name="email" autoComplete="email" placeholder="email@adresiniz.com" required />
          </label>

          <label htmlFor="contact-message">
            <span>03 / Mesaj</span>
            <textarea id="contact-message" name="message" rows="3" placeholder="Projenizden kısaca bahsedin" required />
          </label>

          <button type="submit" disabled={submitStatus === 'submitting'}>
            <span>{submitStatus === 'submitting' ? 'Gönderiliyor...' : 'Mesajı gönder'}</span>
            <i aria-hidden="true">↗</i>
          </button>

          {submitStatus === 'success' && (
            <p className="contact-form-status is-success" role="status">
              Mesajınız gönderildi. En kısa sürede dönüş yapacağım.
            </p>
          )}
          {submitStatus === 'error' && (
            <p className="contact-form-status is-error" role="alert">
              Mesaj gönderilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.
            </p>
          )}
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
