import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import searchReducer from './searchSlice'
import songReducer from './songsSlice'
import playerReducer from './playerSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    songs: songReducer,
    player: playerReducer,
  },
})

// Define RootState
export type RootState = ReturnType<typeof store.getState>

// Define AppDispatch
export type AppDispatch = typeof store.dispatch

export default store
