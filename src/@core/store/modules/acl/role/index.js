import api from "@core/utils/api"
import { ROLE_LIST, ROLE_STORE, ROLE_UPDATE, ROLE_DELETE, ROLE_ALL } from "@core/utils/apiEndpoints"

export default {
  namespaced: true,

  state: {
    allRoles: [],
    role: {},
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
    getRoles: state => state.role?.data || [],
    allRoles: state => state.allRoles || [],
    getPagination: state => state.pagination,
    isLoading: state => state.loading,
  },

  mutations: {
    SET_ALL_ROLE(state, data) {
      state.allRoles = data
    },

    SET_ROLES(state, data) {
      state.role = data
    },

    SET_PAGINATION(state, data) {
      state.pagination = data
    },

    SET_LOADING(state, value) {
      state.loading = value
    },
  },

  actions: {
    async fetchRoleData({ commit }, data) {
      commit('SET_LOADING', true)

      return await api
        .get(ROLE_LIST, data)
        .then(({ data }) => {

          const { roles } = data

          const pagination = {
            current_page: roles.current_page,
            last_page: roles.last_page,
            per_page: roles.per_page,
            total: roles.total,
            from: roles.from,
            to: roles.to,
          }

          commit('SET_ROLES', data.roles)
          commit('SET_LOADING', false)
          commit('SET_PAGINATION', pagination)

        }).catch(error => {
          commit('SET_LOADING', false)
        }).finally(() => {
          commit('SET_LOADING', false)
        })
    },


    async fetchAllRoles({ commit }) {

      return await api
        .get(ROLE_ALL)
        .then(({ data }) => {

          const { roles } = data

          commit('SET_ALL_ROLE', roles)
          commit('SET_LOADING', false)

        }).catch(error => commit('SET_LOADING', false))
        .finally(() => commit('SET_LOADING', false))
    },


    async storeRole({ commit }, data) {
      return new Promise((resolve, reject) => {
        api
          .post(ROLE_STORE, data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {})
      })
    },

    async updateRole({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        let url = ROLE_UPDATE + `/${id}`
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

    async deleteRole({ commit }, id) {
      return new Promise((resolve, reject) => {
        let url = ROLE_DELETE + `/${id}`
        api
          .delete(url)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {})
      })
    },
  },
}