import { Artist } from '../models'
import customFetch from '../utils/customFetch'

export const fetchSingers = async (pageNum = 1, pageSize = 10) => {
  try {
    const response = await customFetch.get(
      `/artists?pageNum=${pageNum}&pageSize=${pageSize}`
    )
    return response.data
  } catch (error) {
    throw new Error('Error fetching top singers: ' + error.message)
  }
}

export const searchArtists = async (keyword: string): Promise<Artist> => {
  try {
    const response = await customFetch.get<Artist>(
      `/artists/search?keyword=${keyword}`
    )
    return response.data
  } catch (error) {
    throw new Error('Error searching artists: ' + error.message)
  }
}
