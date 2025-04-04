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
          path: "/profile",
          name: "adminProfile",
          component: () => import("@/views/admin/Profile.vue"),
        },
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
          path: "/dashboard/books",
          name: "books",
          component: () => import("@/views/admin/BookManagement.vue"),
        },
        {
          path: "/dashboard/publishers",
          name: "publishers",
          component: () => import("@/views/admin/PublisherManagement.vue"),
        },
        {
          path: "/dashboard/employees",
          name: "employees",
          component: () => import("@/views/admin/EmployeeManagement.vue"),
        },
        {
          path: "/dashboard/users",
          name: "users",
          component: () => import("@/views/admin/UserManagement.vue"),
        },
      ],
    },

    {
      path: "/",
      name: "userDashboard",
      component: () => import("@/views/user/UserView.vue"),
      children: [
        {
          path: "/",
          name: "landingPage",
          component: () => import("@/views/Landing.vue"),
        },
        {
          path: "/user/profile",
          name: "userProfile",
          component: () => import("@/views/user/Profile.vue"),
        },
        {
          path: "/books",
          name: "browseBooks",
          component: () => import("@/views/Book.vue"),
        },
        {
          path: "/:id",
          name: "BookDetail",
          component: () => import("@/views/user/BookDetail.vue"),
        },
        {
          path: "/borrow",
          name: "borrow",
          component: () => import("@/views/user/BookStatus.vue"),
        },
      ],
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

  if (
    (to.path === "/login" ||
      to.path === "/signup" ||
      to.path === "/forgot-password") &&
    authStore.isAuthenticated
  ) {
    if (authStore.isDocGia) {
      return next({path: "/"});
    } else if (authStore.isNhanVien || authStore.isAdmin) {
      return next({path: "/dashboard"});
    }
  }

  next();
});

export default router;
