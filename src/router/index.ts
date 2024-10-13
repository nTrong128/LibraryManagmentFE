import {createRouter, createWebHistory} from "vue-router";

import {Role} from "@/types/models";
import {useAuthStore} from "@/stores/authStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/dashboard",
      name: "adminDashboard",
      component: () => import("@/views/admin/AdminView.vue"),
      meta: {requiresAuth: true, role: [Role.ADMIN, Role.NHANVIEN]},
      children: [
        {
          path: "/dashboard/",
          name: "dashboard",
          component: () => import("@/views/admin/DashBoard.vue"),
        },
        {
          path: "/dashboard/applications",
          name: "applications",
          component: () => import("@/views/admin/BorrowApplication.vue"),
        },
        {
          path: "/dashboard/books/:page?",
          name: "books",
          component: () => import("@/views/admin/BookManagement.vue"),
          props: (route) => ({page: parseInt(route.query.page as string) || 1}),
        },
      ],
    },
    {
      path: "/",
      name: "landingPage",
      component: () => import("@/views/Landing.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/Login.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/auth/Signup.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("@/views/auth/ForgotPassword.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/user/AboutView.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    await authStore.checkingAuth();
  }

  if (to.meta.requiresAuth) {
    const allowedRoles = to.meta.role as Role[];
    if (allowedRoles && !allowedRoles.includes(authStore.role!)) {
      if (authStore.isDocGia) {
        return next({path: "/"});
      }
    }

    if (!authStore.isAuthenticated) {
      return next({path: "/login"});
    }
  }

  if ((to.path === "/login" || to.path === "/signup") && authStore.isAuthenticated) {
    if (authStore.isDocGia) {
      return next({path: "/"});
    } else if (authStore.isNhanVien) {
      return next({path: "/dashboard"});
    }
  }

  next();
});

export default router;
