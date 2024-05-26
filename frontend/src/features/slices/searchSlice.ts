import { createSlice } from '@reduxjs/toolkit'

interface SearchState {
  keyword: string
  isSearchSong: boolean
}

const initialState: SearchState = {
  keyword: '',
  isSearchSong: true,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeyword: (state, { payload }) => {
      state.keyword = payload
    },
    setSearchSong: (state) => {
      state.isSearchSong = true
    },
    setSearchArtist: (state) => {
      state.isSearchSong = false
    },
  },
})

export const { setKeyword, setSearchSong, setSearchArtist } =
  searchSlice.actions
export default searchSlice.reducer
