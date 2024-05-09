import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Song } from '../models'
import customFetch from '../utils/customFetch'
import { Alert } from 'react-native'

interface SongsState {
  heading: string
  items: Song[] | null
  isLoading: boolean
}

const initialState: SongsState = {
  heading: 'Songs',
  items: null,
  isLoading: false,
}

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async ({ url, heading }: { url: string; heading: string }) => {
    try {
      const response = await customFetch.get(url)
      return { data: response.data, heading }
      return
    } catch (error) {
      if (error.response.data.errors?.length > 0) {
        throw error.response.data.errors[0]
      } else {
        throw error
      }
    }
  }
)

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSongs.fulfilled, (state, { payload }) => {
        state.items = payload.data.items
        state.heading = payload.heading
        state.isLoading = false
      })
      .addCase(fetchSongs.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
  },
})

export default songsSlice.reducer
