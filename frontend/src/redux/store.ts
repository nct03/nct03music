import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import searchReducer from './searchSlice'
import songReducer from './songsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    songs: songReducer,
  },
})

// Define RootState
export type RootState = ReturnType<typeof store.getState>

// Define AppDispatch
export type AppDispatch = typeof store.dispatch

export default store
