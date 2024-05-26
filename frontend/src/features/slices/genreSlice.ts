import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Genre } from '../../models'
import { Alert } from 'react-native'
import { RootState } from '../store'
import { getGenres } from '../../apis/genreService'

interface GenreState {
  genres: Genre[] | null
  isLoading: boolean
}

const initialState: GenreState = {
  genres: null,
  isLoading: false,
}

export const fetchGenres = createAsyncThunk('genre/fetchGenres', async () => {
  const data = getGenres()
  return data
})

const genreSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchGenres.fulfilled, (state, { payload }) => {
        state.genres = payload
        state.isLoading = false
      })
      .addCase(fetchGenres.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
  },
})

export const selectGenre = (state: RootState) => state.genre
const genreReducer = genreSlice.reducer
export default genreReducer
