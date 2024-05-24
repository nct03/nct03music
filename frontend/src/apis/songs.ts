import { Song } from '../models'
import customFetch from '../utils/customFetch'

export const fetchRecentlySongs = async () => {
  try {
    const response = await customFetch.get(`/songs/recently`)
    return response.data
  } catch (error) {
    throw new Error('Error fetching recently released songs: ' + error.message)
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