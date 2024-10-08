import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/DashBoard.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/applications",
      name: "applications",
      component: () => import("@/views/BorrowApplication.vue"),
    },
    {
      path: "/books/:page?",
      name: "books",
      component: () => import("@/views/BookManagement.vue"),
      props: (route) => ({page: parseInt(route.query.page as string) || 1}),
    },
  ],
});

export default router;
