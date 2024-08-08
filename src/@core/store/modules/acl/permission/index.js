import api from "@core/utils/api"
import {
  PERMISSION_ALL,
  PERMISSION_DELETE,
  PERMISSION_LIST,
  PERMISSION_STORE,
  PERMISSION_UPDATE,
} from "@core/utils/apiEndpoints"

export default {
  namespaced: true,

  state: {
    allPermissions: [],
    permission: {},
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
    getPermissions: state => state.permission?.data || [],
    allPermissions: state => state.allPermissions || [],
    getPagination: state => state.pagination,
    isLoading: state => state.loading,
  },

  mutations: {
    SET_PERMISSIONS(state, data) {
      state.permission = data
    },
    
    SET_ALL_PERMISSION(state, data) {
      state.allPermissions = data
    },

    SET_PAGINATION(state, data) {
      state.pagination = data
    },

    SET_LOADING(state, value) {
      state.loading = value
    },
  },

  actions: {
    async fetchPermissionData({ commit }, data) {
      commit('SET_LOADING', true)

      return await api
        .get(PERMISSION_LIST, data)
        .then(({ data }) => {

          const { permissions } = data

          const pagination = {
            current_page: permissions.current_page,
            last_page: permissions.last_page,
            per_page: permissions.per_page,
            total: permissions.total,
            from: permissions.from,
            to: permissions.to,
          }

          commit('SET_PERMISSIONS', permissions)
          commit('SET_PAGINATION', pagination)
          commit('SET_LOADING', false)

        }).catch(error => commit('SET_LOADING', false))
        .finally(() => commit('SET_LOADING', false))
    },

    async fetchAllPermissions({ commit }) {

      return await api
        .get(PERMISSION_ALL)
        .then(({ data }) => {

          const { permissions } = data

          commit('SET_ALL_PERMISSION', permissions)
          commit('SET_LOADING', false)

        }).catch(error => commit('SET_LOADING', false))
        .finally(() => commit('SET_LOADING', false))
    },

    async storePermission({ commit }, data) {

      commit('SET_LOADING', true)

      return new Promise((resolve, reject) => {
        api
          .post(PERMISSION_STORE, data)
          .then(({ data }) => {
            commit('SET_LOADING', false)
            resolve(data)
          })
          .catch(error => {
            commit('SET_LOADING', false)
            reject(error)
          })
      })
    },

    async updatePermission({ commit }, { id, data }) {

      commit('SET_LOADING', true)

      return new Promise((resolve, reject) => {

        const url = PERMISSION_UPDATE + `/${id}`

        api
          .put(url, data)
          .then(({ data }) => {
            commit('SET_LOADING', false)
            resolve(data)
          })
          .catch(error => {
            commit('SET_LOADING', false)
            reject(error)
          })
      })
    },

    async deletePermission({ commit }, id) {

      commit('SET_LOADING', true)

      return await api
        .delete(PERMISSION_DELETE + `/${id}`)
        .then(response => response)
        .catch(error => error)
        .finally(() => {})
    },
  },
}