import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // Palette
          primary: '#1D546D',
          secondary: '#5F9598',
          background: '#F3F4F4',
          surface: '#FFFFFF',

          // okunabilirlik (opsiyonel ama faydalı)
          'on-primary': '#FFFFFF',
          'on-surface': '#061E29',
          'on-background': '#061E29',
        },
      },
    },
  },

  // tekrar tekrar prop yazmamak için default'lar
  defaults: {
    VTextField: {
      variant: 'outlined',
      color: 'primary',
      bgColor: 'surface',
    },
    VBtn: {
      color: 'primary',
    },
  },
})

export default vuetify
