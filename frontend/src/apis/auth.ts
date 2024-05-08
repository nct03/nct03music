import { RegisterRequest, JWToken, LoginRequest } from '../models'
import customFetch from '../utils/customFetch'

export const signup = async (register: RegisterRequest): Promise<JWToken> => {
  try {
    const response = await customFetch.post<JWToken>('/auth/register', register)
    return response.data
  } catch (err) {
    if (err.response.data.errors?.length > 0) {
      throw err.response.data.errors[0]
    } else {
      throw err
    }
  }
}

export const login = async (login: LoginRequest): Promise<JWToken> => {
  try {
    const response = await customFetch.post<JWToken>(
      `/auth/authenticate`,
      login
    )
    return response.data
  } catch (err) {
    if (err.response.data.errors?.length > 0) {
      throw err.response.data.errors[0]
    } else {
      throw err
    }
  }
}

export const logout = async () => {
  try {
    await customFetch.post('/auth/logout')
  } catch (err) {
    if (err.response.data.errors?.length > 0) {
      throw err.response.data.errors[0]
    } else {
      throw err
    }
  }
}
