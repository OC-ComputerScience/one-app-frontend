import { createStore } from "vuex"
import Utils from "../config/utils"


const user = Utils.getStore("user")

const store = createStore({
    state: {
        loginUser: user
    },
    mutations: {
        setLoginUser(state, user) {
            state.loginUser = user
            Utils.setStore("user", user)
        },
        removeLoginUser(state) {
            state.loginUser = null
            Utils.removeStore("user")
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