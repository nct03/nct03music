import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { JWToken, LoginRequest, RegisterRequest } from '../../models'
import { login, logout, signup } from '../../apis/auth'
import {
  getTokenFromStorage,
  removeTokenFromStorage,
  saveTokenToStorage,
} from '../../utils/localStorage'
import { Alert } from 'react-native'
import { RootState } from '../store'

interface AuthState {
  token: JWToken | null
  isLoading: boolean
}

const initialState: AuthState = {
  token: null,
  isLoading: false,
}

export const fetchTokenFromStorage = createAsyncThunk(
  'auth/fetchToken',
  async () => {
    const token = await getTokenFromStorage()
    return token
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (user: RegisterRequest) => {
    const data = await signup(user)
    return data
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (user: LoginRequest) => {
    const data = await login(user)
    return data
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenFromStorage.fulfilled, (state, { payload }) => {
        state.token = payload
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        console.log(payload)
        state.token = payload
        saveTokenToStorage(payload)
        state.isLoading = false
      })
      .addCase(registerUser.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        console.log(payload)
        state.token = payload
        saveTokenToStorage(payload)
        state.isLoading = false
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // console.log(payload)
        state.token = null
        state.isLoading = false
        removeTokenFromStorage()
      })
      .addCase(logoutUser.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
  },
})

export const selectToken = (state: RootState) => state.auth.token
export default authSlice.reducer
