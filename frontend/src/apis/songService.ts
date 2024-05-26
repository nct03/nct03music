import { Song } from '../models'
import customFetch from '../utils/customFetch'

export const getRecentSongs = async () => {
  try {
    const response = await customFetch.get(`/songs/recently`)
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      return
    }
    throw error
  }
}

export const searchSongs = async (keyword: string): Promise<Song> => {
  try {
    const response = await customFetch.get<Song>(
      `/songs/search?keyword=${keyword}`
    )
    return response.data
  } catch (error) {
    throw new Error('Error searching songs: ' + error.message)
  }
}
