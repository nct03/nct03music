import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PageableResponse, Playlist, Song } from '../../models'
import { RootState } from '../store'
import {
  createPlaylistAPI,
  deletePlaylistAPI,
  getSongsInFavorite,
  getSongsInPlaylistAPI,
  getUserPlaylists,
} from '../../apis/playlistService'

interface PlaylistState {
  userPlaylists: PageableResponse<Playlist>
  songsInPlaylist: PageableResponse<Song>
  isLoading: boolean
  isDetailsLoading: boolean
}

const initialState: PlaylistState = {
  userPlaylists: null,
  songsInPlaylist: null,
  isLoading: true,
  isDetailsLoading: true,
}

export const fetchUserPlaylists = createAsyncThunk(
  'playlist/fetchUserPlaylists',
  async ({
    pageNum = 1,
    pageSize = 5,
  }: {
    pageNum?: number
    pageSize?: number
  }) => {
    const data = getUserPlaylists(pageNum, pageSize)
    return data
  }
)

export const createNewPlaylist = createAsyncThunk(
  'playlist/createNewPlaylist',
  async (name: string) => {
    const data = createPlaylistAPI(name)
    return data
  }
)

export const deletePlaylist = createAsyncThunk(
  'playlist/deletePlaylist',
  async (id: number) => {
    const data = deletePlaylistAPI(id)
    return data
  }
)

export const fetchSongsInPlaylist = createAsyncThunk(
  'playlist/fetchSongsInPlaylist',
  async ({
    playlistId,
    pageNum = 1,
    pageSize = 5,
  }: {
    playlistId: number
    pageNum?: number
    pageSize?: number
  }) => {
    if (playlistId === 0) {
      const data = getSongsInFavorite(pageNum, pageSize)
      return data
    } else {
      const data = getSongsInPlaylistAPI(playlistId, pageNum, pageSize)
      return data
    }
  }
)

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, { payload }) => {
        state.userPlaylists = payload
        state.isLoading = false
      })
      .addCase(fetchUserPlaylists.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(fetchSongsInPlaylist.pending, (state) => {
        state.isDetailsLoading = true
      })
      .addCase(fetchSongsInPlaylist.fulfilled, (state, { payload }) => {
        state.songsInPlaylist = payload
        state.isDetailsLoading = false
      })
      .addCase(fetchSongsInPlaylist.rejected, (state) => {
        state.isDetailsLoading = false
      })
  },
})

export const selectPlaylist = (state: RootState) => state.playlist
const playlistReducer = playlistSlice.reducer
export default playlistReducer
