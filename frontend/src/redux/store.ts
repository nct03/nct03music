import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import searchReducer from './searchSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  },
})

// Define RootState
export type RootState = ReturnType<typeof store.getState>

// Define AppDispatch
export type AppDispatch = typeof store.dispatch

export default store
