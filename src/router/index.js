import Vue from "vue";
import VueRouter from "vue-router";

import Auth from "../middleware/auth";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Links from "../views/Links.vue";
import Online from "../views/Online.vue";
import Versions from "../views/Versions.vue";
import Apis from "../views/Apis.vue"


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      middleware: Auth
    }
  },
  {
    path: "/links",
    name: "Links",
    component: Links,
    meta: {
      middleware: Auth
    }
  },
  {
    path: "/online",
    name: "Online users",
    component: Online,
    meta: {
      middleware: Auth
    }
  },
  {
    path: "/versions",
    name: "Versions",
    component: Versions,
    meta: {
      middleware: Auth
    }
  },
  {
    path: "/apis",
    name: "APIS",
    component: Apis,
    meta: {
      middleware: Auth
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/logout",
    name: "Logout",
    component: {
      beforeRouteEnter(to, from, next) {
        localStorage.removeItem('token');
        next({ path: "/login" });
      }
    }
  },
  {
    path: "*",
    name: "404",
    component: {
      beforeRouteEnter(to, from, next) {
        next({ path: "/" });
      }
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  if (!subsequentMiddleware) return context.next;
  return (...parameters) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);
    return middleware[0]({ ...context, next: nextMiddleware });
  }
  return next();
});

export default router;
