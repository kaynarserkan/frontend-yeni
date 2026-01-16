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
          primary: '#1D546D',
          secondary: '#5F9598',
          background: '#F3F4F4',
          surface: '#FFFFFF',
          error: '#D32F2F',
          info: '#1D546D',
          success: '#2E7D32',
          warning: '#ED6C02',
        },
      },
    },
  },
})


export default vuetify
