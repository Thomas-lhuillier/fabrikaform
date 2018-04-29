import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";

import Home from "./views/Home.vue";
import Projects from "./views/Projects.vue";
import Contact from "./views/Contact.vue";
import Login from "./views/Login.vue";
import Admin from "./views/admin/Dashboard.vue";
import AdminArticle from "./views/admin/AdminArticle.vue";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/projects",
      name: "projects",
      component: Projects
    },
    {
      path: "/contact",
      name: "contact",
      component: Contact
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/admin/new-article",
      name: "new-article",
      component: AdminArticle,
      meta: {
        back: { name: "admin" },
        requiresAuth: true
      }
    },
    {
      path: "/admin/edit-article/:articleId",
      name: "edit-article",
      component: AdminArticle,
      props: true,
      meta: {
        back: { name: "admin" },
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next("login");
    // } else if (!requiresAuth && currentUser) {
    //   next("admin");
  } else {
    next();
  }
});

export default router;
