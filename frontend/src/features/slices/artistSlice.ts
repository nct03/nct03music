import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Artist, PageableResponse } from '../../models'
import { Alert } from 'react-native'
import { RootState } from '../store'
import { getArtists } from '../../apis/artistService'

interface ArtistState {
  artists: PageableResponse<Artist> | null
  isLoading: boolean
}

const initialState: ArtistState = {
  artists: null,
  isLoading: false,
}

export const fetchArtists = createAsyncThunk(
  'artist/fetchArtists',
  async () => {
    const data = getArtists()
    return data
  }
)

const artistSlice = createSlice({
  name: 'artist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchArtists.fulfilled, (state, { payload }) => {
        state.artists = payload
        state.isLoading = false
      })
      .addCase(fetchArtists.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
  },
})

export const selectArtist = (state: RootState) => state.artist
const artistReducer = artistSlice.reducer
export default artistReducer
