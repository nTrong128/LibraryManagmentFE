import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/dashboard",
      name: "adminDashboard",
      component: () => import("@/views/admin/AdminView.vue"),
      children: [
        {
          path: "/dashboard/",
          name: "dashboard",
          component: () => import("@/views/admin/Dashboard.vue"),
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

export default router;
