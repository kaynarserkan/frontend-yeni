import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/core/auth/auth.store'
import { useTenantStore } from '@/core/tenant/tenant.store'

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use(config => {
  const auth = useAuthStore()
  const tenant = useTenantStore()

  // ✅ Zorunlu: X-Tenant
  config.headers = config.headers ?? {}
  config.headers['X-Tenant'] = tenant.tenantKey

  // ✅ Zorunlu: Accept-Language (şimdilik localStorage -> yoksa 'en')
  const lang = localStorage.getItem('lang') ?? 'en'
  config.headers['Accept-Language'] = lang

  // ✅ JWT varsa ekle
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }

  return config
})

api.interceptors.response.use(
  res => res,
  async error => {
    const status = error?.response?.status

    if (status === 401) {
      const auth = useAuthStore()
      auth.logout()

      // guard zaten login'e atacak ama garantileyelim
      if (router.currentRoute.value.name !== 'login') {
        await router.push({ name: 'login' })
      }
    }

    return Promise.reject(error)
  },
)
