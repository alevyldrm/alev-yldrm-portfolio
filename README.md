# Alev Yıldırım Portfolio

React ve Vite ile geliştirilmiş, yatay kaydırma deneyimine sahip kişisel frontend developer portfolyo projesi.

## Özellikler

- Masaüstü cihazlarda dikey scroll ile kontrol edilen yatay bölüm akışı
- Mobil cihazlarda responsive dikey yerleşim
- WebGL tabanlı Ferrofluid arka plan efekti
- Etkileşimli teknik yetenekler ve proje sunumu
- MP3 destekli plak oynatıcı
- Gemini destekli Portfolio Assistant
- Netlify Functions ile sunucu tarafında güvenli AI entegrasyonu

## Teknolojiler

- React 19
- Vite 6
- Framer Motion
- OGL / WebGL
- Google Gemini API
- Netlify Functions

## Yerel Kurulum

```bash
npm install
npm run dev
```

AI asistanını yerelde kullanmak için proje kökünde `.env.local` dosyası oluşturun:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
```

Gerçek API anahtarları GitHub'a gönderilmemelidir. `.env.local` ve diğer yerel ortam dosyaları `.gitignore` tarafından dışlanır.

## Komutlar

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Yayınlama

Proje Netlify için yapılandırılmıştır. Build ayarları `netlify.toml` dosyasında, Portfolio Assistant endpoint'i ise `netlify/functions/portfolio-chat.js` dosyasında bulunur.
