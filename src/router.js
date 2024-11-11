import { createRouter, createWebHistory } from "vue-router";
import StudentHome from "./views/StudentHome.vue"
import AdminHome from "./views/AdminHome.vue";
import UniversityHome from "./views/UniversityHome.vue";
import Form from "./views/Form.vue";
import store from "./store/store"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/home",
      name: "home",
      beforeEnter: (to, from, next) => {
        let user = store.getters.getUser
        if(!store.getters.isAuthenticated) next("/")
        else if(user.role === "Admin") next("/adminHome")
        else if(user.role === "Student") next("/studentHome")
        else if(user.role === "University") next("/universityHome")
      }
    },
    {
      path: "/adminHome",
      name: "adminHome",
      component: AdminHome
    },
    {
      path: "/editForm",
      name: "editForm",
      component: Form
    },
    {
      path: "/studentHome",
      name: "studentHome",
      component: StudentHome
    },
    {
      path: "/universityHome",
      name: "universityHome",
      component: UniversityHome
    }
  ],
});

export default router;
