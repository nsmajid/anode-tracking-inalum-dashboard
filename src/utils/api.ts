import { API_KEY_HEADER, BASE_API_URL } from '@/config/constants'
import axios from 'axios'

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  async (config) => {
    // Do something before request is sent

    // const customAuthHeaders = await getAuthHeaders()

    // @ts-ignore
    config.headers = {
      ...config.headers,
      ...API_KEY_HEADER
      // ...customAuthHeaders
    }

    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error) => {
    const { status } = error?.response ?? {}
    if (status === 401) {
      // TODO: redirect
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default api
