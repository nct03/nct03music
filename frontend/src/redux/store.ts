import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Define RootState
export type RootState = ReturnType<typeof store.getState>

// Define AppDispatch
export type AppDispatch = typeof store.dispatch

export default store
