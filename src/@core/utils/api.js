import axios from 'axios'
import Storage from "@core/bits/Storage"

const baseURL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Storage.get('user')?.token}`,
  },
})

const api = {
  /**
   * Get Request
   * @param url
   * @param params
   * @returns {Promise<*>}
   */
  async get(url, params = {}) {
    try {
      const response = await axiosInstance.get(url, { params } )

      return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw error
      }
      throw error
    }
  },

  /**
   * Post Request
   * @param url
   * @param data
   * @returns {Promise<*>}
   */
  async post(url, data = {}) {
    try {
      const response = await axiosInstance.post(url, data)

      return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw error
      }
      throw error
    }
  },

  /**
   * Put Request
   * @param url
   * @param data
   * @returns {Promise<*>}
   */

  async put(url, data = {}) {
    try {
      
      data._method = 'PUT'

      const response = await axiosInstance.post(url, data)

      return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw error
      }
      throw error
    }
  },

  /**
   * Delete Request
   * @param url
   * @returns {Promise<*>}
   */
  async delete(url) {
    try {
      const response = await axiosInstance.delete(url)

      return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw error
      }
      throw error
    }
  },

}

export default api