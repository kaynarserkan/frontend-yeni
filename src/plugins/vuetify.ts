import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
  light: {
    dark: false,
    colors: {
      /* Yeni Palet
         #F5FBE6  (light bg)
         #215E61  (teal)
         #233D4D  (navy)
         #FE7F2D  (accent / action)
      */

      primary: '#215E61',        // ana mavi/teal
      secondary: '#233D4D',      // koyu navy
      accent: '#FE7F2D',         // CTA / vurgu
      background: '#F5FBE6',     // açık zemin
      surface: '#FFFFFF',

      info: '#215E61',
      success: '#215E61',
      warning: '#FE7F2D',
      error: '#233D4D',

      'on-primary': '#FFFFFF',
      'on-secondary': '#FFFFFF',
      'on-accent': '#FFFFFF',
      'on-surface': '#233D4D',
      'on-background': '#233D4D',
    },
  },
},

  },

  // Component default'ları: tutarlılık + mavi ağırlık
  defaults: {
    VTextField: {
      variant: 'outlined',
      color: 'primary',
      bgColor: 'surface',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      color: 'primary',
      bgColor: 'surface',
      density: 'comfortable',
    },
    VBtn: {
      color: 'primary',
      variant: 'flat',
    },
  },
})

export default vuetify