import { createRouter, createWebHistory } from "vue-router";
import authService from "@/services/auth.service";

const routes = [
  {
    path: "/dashboard",
    name: "dashboard",
    meta: {
      template: "admin",
      auth: true,
    },
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/DashboardView.vue"),
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        name: "auth-login",
        meta: {
          template: "auth",
          auth: false,
        },
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/Auth/LoginView.vue"),
      },
    ],
  },
  {
    path: "/:path(.*)",
    name: "page",
    meta: {
      template: "admin",
      auth: true,
    },
    component: () =>
      import(/* webpackChunkName: "page" */ "../views/PageView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.auth !== false) {
    const status = await authService.isTokensExpired();
    if (status == -1) {
      return { name: "auth-login" };
    }
  }
});

export default router;
