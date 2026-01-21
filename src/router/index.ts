import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/pages/LoginView.vue'),
  },
  {
    path: '/',
    component: () => import('@/core/layout/MasterLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        components: {
          default: () => import('@/modules/dashboard/pages/DashboardView.vue'),
          //sidebar: () => import('@/modules/dashboard/components/DashboardKanbanSidebar.vue'),
        },
      },
    ],
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  const publicRoutes = new Set(['login'])
  const isPublic = typeof to.name === 'string' && publicRoutes.has(to.name)

  // token kontrolü store üzerinden olmalı
  // ama router dosyasında pinia instance yokken store çekmek için: lazy import yapıyoruz
  // (bu projede şimdilik en sade yol)
  return (async () => {
    const { useAuthStore } = await import('@/core/auth/auth.store')
    const auth = useAuthStore()

    if (!isPublic && !auth.isLoggedIn) {
      return { name: 'login' }
    }

    if (to.name === 'login' && auth.isLoggedIn) {
      return { name: 'dashboard' }
    }

    return true
  })()
})

export default router
