import api from "@core/utils/api"
import Storage from "@core/bits/Storage"
import { AUTH_USER, LOGIN_URL, LOGOUT_URL } from "@core/utils/apiEndpoints"


export default {
  namespaced: true,

  state: {
    user: null,
  },
  
  getters: {
    isLoggedIn: state => !!state.user,
    authToken: state => state.user?.token || null,
  },
  
  mutations: {
    SET_USER(state, payload) {
      state.user = payload
    },

    CLEAR_USER() {
      Storage.remove('user')
      location.reload()
    },
  },
  
  actions: {
    async login({ commit }, credentials) {
      return await api
        .post(LOGIN_URL, credentials)
        .then(({ data }) => {
          commit('SET_USER', data)
          Storage.set('user', data)
        })
    },

    async logout({ commit }) {
      return await api
        .post(LOGOUT_URL)
        .then(() => {
          commit('CLEAR_USER')
          commit('SET_USER', null)
        })
    },

    async fetchAuthenticatedUser({ commit }) {

      return new Promise((resolve, reject) => {
        api.get(AUTH_USER).then(response => {

          resolve(response)

          const user = Storage.get('user')

          if (user) {
            commit('SET_USER', user)
            Storage.set('user', user)
          }

        }).catch(error => {
          reject(error)
          Storage.remove('user')
          location.reload()
        })
      })
    },
  },
}