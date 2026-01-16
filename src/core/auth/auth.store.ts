import { defineStore } from 'pinia'
import { clearAccessToken, getAccessToken, setAccessToken } from './auth.storage'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: getAccessToken(),
  }),
  getters: {
    isLoggedIn: state => Boolean(state.accessToken),
  },
  actions: {
    setToken(token: string) {
      this.accessToken = token
      setAccessToken(token)
    },
    logout() {
      this.accessToken = ''
      clearAccessToken()
    },
  },
})
