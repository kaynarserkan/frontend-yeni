import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/auth/pages/LoginView.vue"),
  },
  {
    path: "/",
    component: () => import("@/core/layout/MasterLayout.vue"),
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/modules/dashboard/pages/DashboardView.vue"),
      },
      // Users (real module)
      {
        path: "users",
        name: "users-list",
        components: {
          default: () => import("@/modules/user/pages/UsersListView.vue"),
          sidebar: () =>
            import("@/modules/user/pages/profile/SidebarUsage.example.vue"),
        },
      },
      {
        path: "users/:id",
        component: () =>
          import("@/modules/user/pages/profile/UserProfileLayout.vue"),
        children: [
          { path: "", redirect: { name: "users-profile-account" } },
          {
            path: "account",
            name: "users-profile-account",
            component: () =>
              import("@/modules/user/pages/profile/UserAccountPage.vue"),
          },
          {
            path: "roles",
            name: "users-profile-roles",
            component: () =>
              import("@/modules/user/pages/profile/UserRolesPermissionsPage.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const publicRoutes = new Set(["login"]);
  const isPublic = typeof to.name === "string" && publicRoutes.has(to.name);

  // token kontrolü store üzerinden olmalı
  // ama router dosyasında pinia instance yokken store çekmek için: lazy import yapıyoruz
  // (bu projede şimdilik en sade yol)
  return (async () => {
    const { useAuthStore } = await import("@/core/auth/auth.store");
    const auth = useAuthStore();

    if (!isPublic && !auth.isLoggedIn) {
      return { name: "login" };
    }

    if (to.name === "login" && auth.isLoggedIn) {
      return { name: "dashboard" };
    }

    return true;
  })();
});

export default router;
