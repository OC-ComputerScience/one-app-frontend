import { createRouter, createWebHistory } from "vue-router";
import StudentHome from "./views/StudentHome.vue"
import AdminHome from "./views/AdminHome.vue";
import UniversityHome from "./views/UniversityHome.vue";
import UniversityList from "./views/UniversityList.vue";
import FormList from "./views/FormList.vue";
import UserList from "./views/UserList.vue";
import Form from "./views/Form.vue";
import StudentApplication from "./views/StudentApplication.vue";
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
      path: "/editForm/:formId",
      name: "editForm",
      component: Form,
      params: true
    },
    {
      path: "/studentHome",
      name: "studentHome",
      component: StudentHome
    },
    {
      path: "/application",
      name: "application",
      component: StudentApplication
    },
    {
      path: "/universityHome",
      name: "universityHome",
      component: UniversityHome
    },
    {
      path: "/universityList",
      name: "universityList",
      component: UniversityList
    },
    {
      path: "/formList",
      name: "formList",
      component: FormList
    },
    {
      path: "/userList",
      name: "userList",
      component: UserList
    }
  ],
});


export default router;
