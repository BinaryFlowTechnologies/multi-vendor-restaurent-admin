import api from "@core/utils/api"
import { USER_DELETE, USER_LIST } from "@core/utils/apiEndpoints"

export default {
  namespaced: true,

  state: {
    user: {},
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0,
    },
    loading: false,
    errors: {},
  },

  getters: {
    getUsers: state => state.user?.data || [],
    getPagination: state => state.pagination,
    isLoading: state => state.loading,
  },

  mutations: {
    SET_USER(state, data) {
      state.user = data
    },

    SET_USERS(state, data) {
      state.user = data
    },

    SET_PAGINATION(state, data) {
      state.pagination = data
    },

    SET_LOADING(state, value) {
      state.loading = value
    },
  },

  actions: {
    async fetchUserData({ commit }, data) {
      commit('SET_LOADING', true)
      
      return await api
        .get(USER_LIST, data)
        .then(({ data }) => {

          const { users } = data

          const pagination = {
            current_page: users.current_page,
            last_page: users.last_page,
            per_page: users.per_page,
            total: users.total,
            from: users.from,
            to: users.to,
          }

          commit('SET_USERS', data.users)
          commit('SET_LOADING', false)
          commit('SET_PAGINATION', pagination)

        }).catch(error => {
          commit('SET_LOADING', false)
        }).finally(() => {
          commit('SET_LOADING', false)
        })
    },


    async storeUser({ commit }, data) {
      return new Promise((resolve, reject) => {
        api
          .post(USER_LIST, data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {})
      })
    },
    
    async updateUser({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        let url = USER_LIST + `/${id}`
        api
          .put(url, data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {})
      })
    },
    
    async deleteUser({ commit }, id) {
      return await api
        .delete(USER_DELETE + `/${id}`)
        .then(response => response)
        .catch(error => error)
        .finally(() => {})
    },
  },
}