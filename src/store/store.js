import { createStore } from "vuex"
import Utils from "../config/utils"
import RoleServices from "../services/RoleServices.js"

const user = Utils.getStore("user")

const store = createStore({
    state: {
        loginUser: user
    },
    mutations: {
        setLoginUser(state, user) {
            state.loginUser = user
            Utils.setStore("user", user)
        }
    },
    actions: {
      login({ commit }, user) {
        commit("setLoginUser", user);
      },
    },
    getters: {
        getUser(state) {
            return state.loginUser
        },
        isAuthenticated(state) {
            return state.loginUser !== null
        }
    }
})

export default store