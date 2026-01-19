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
  primary: '#2AA2D4',        // ana mavi
  secondary: '#102757',      // koyu navy
  accent: '#8d0b0b',         // vurgu / CTA
  background: '#f0f0f1',     // açık zemin
  surface: '#FFFFFF',

  info: '#2AA2D4',
  success: '#2AA2D4',
  warning: '#8d0b0b',
  error: '#102757',

  'on-primary': '#FFFFFF',
  'on-secondary': '#FFFFFF',
  'on-accent': '#102757',
  'on-surface': '#102757',
  'on-background': '#102757',
},
    
      },
    },
  },

 defaults: {
  /* ====== TYPOGRAPHY (Başlıklar / Metin) ====== */
  VApp: {
    style: [
      {
      },
    ],
  },
  VToolbarTitle: {
    class: 'crm-h6',
  },

  /* ====== ICONS ====== */
  VIcon: {
    size: '20',
  },

  /* ====== INPUTS ====== */
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
  VAutocomplete: {
    variant: 'outlined',
    color: 'primary',
    bgColor: 'surface',
    density: 'comfortable',
  },

  /* ====== BUTTONS ====== */
  VBtn: {
    color: 'primary',
    variant: 'flat',
    height: 40,
  },
},

})

export default vuetify
