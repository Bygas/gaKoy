/** @type {import('tailwindcss').Config} */

const themeColor =
  name =>
  ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(--color-${name}) / ${opacityValue})`
    }
    return `rgb(var(--color-${name}))`
  }

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: themeColor('bg'),        // Arka plan
        panel: themeColor('panel'),  // Panel yüzeyi
        text: themeColor('text'),    // Metin rengi
        accent: '#c8a45c',           // Vurgu (altın ton)
        danger: '#c34043',           // Tehlike
        success: '#5a9e6f',          // Başarı
        water: '#4c6e8a',            // Su tonu
        earth: '#8b6914',            // Toprak tonu
        muted: '#6b7280',            // Soluk renk
        'quality-fine': '#d4976a',       // Kalite: İyi
        'quality-excellent': '#a8c4d4',  // Kalite: Pekiyi
        'quality-supreme': '#ffd700'     // Kalite: Efsane
      },
      fontFamily: {
        game: ['zpix', 'monospace'] // Oyun yazı tipi
      },
      spacing: {
        30: '7.5rem',
        62.5: '15.625rem',
        110: '27.5rem',
        150: '37.5rem'
      },
      flex: {
        32: '32',
        36: '36'
      },
      borderRadius: {
        xs: '0.125rem' // Çok küçük köşe yuvarlama
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90'
      }
    }
  },
  plugins: []
}
