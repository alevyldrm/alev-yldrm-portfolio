# Alev Yildirim Portfolio

React ve Vite ile gelistirilmis, yatay kaydirma deneyimine sahip kisisel frontend developer portfolio projesi.

## Ozellikler

- Desktop cihazlarda dikey scroll ile kontrol edilen yatay section akisi
- Mobil cihazlarda responsive dikey yerlesim
- WebGL tabanli Ferrofluid arka plan efekti
- Etkilesimli teknik yetenekler ve proje sunumu
- MP3 destekli plak oynatici
- Gemini destekli Portfolio Assistant
- Netlify Functions ile sunucu tarafinda guvenli AI entegrasyonu

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

AI asistani yerelde kullanmak icin proje kokunde `.env.local` dosyasi olusturun:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
```

Gercek API anahtarlari GitHub'a gonderilmemelidir. `.env.local` ve diger yerel environment dosyalari `.gitignore` tarafindan dislanir.

## Komutlar

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Yayinlama

Proje Netlify icin yapilandirilmistir. Build ayarlari `netlify.toml` dosyasinda, Portfolio Assistant endpoint'i ise `netlify/functions/portfolio-chat.js` dosyasinda bulunur.
