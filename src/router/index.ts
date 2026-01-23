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

      // Departments (config-service)
      {
        path: "departments",
        name: "departments-list",
        component: () =>
          import("@/modules/departments/pages/DepartmentsListView.vue"),
      },

      // Roles
      {
        path: "roles",
        name: "roles-list",
        component: () => import("@/modules/roles/pages/RolesListView.vue"),
      },

      // Users (user-service)
      {
        path: "users",
        name: "users-list",
        component: () => import("@/modules/user/pages/UsersListView.vue"),
      },

      // User profile (tabs)
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
            path: "roles-permissions",
            name: "users-profile-roles-permissions",
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
