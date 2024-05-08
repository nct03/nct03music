import axios from 'axios'
import { BasicIP } from '../constant/Constants'
import store, { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import { selectToken } from '../redux/auth/authSlice'
import { getTokenFromStorage } from './localStorage'

const customFetch = axios.create({
  baseURL: BasicIP,
})
customFetch.interceptors.request.use(
  async (config) => {
    // Get the token from Redux state

    const token = await getTokenFromStorage()

    // Add token to request headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default customFetch
