import { Artist } from '../models'
import customFetch from '../utils/customFetch'

export const getArtists = async () => {
  try {
    const response = await customFetch.get(`/artists`)
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      return
    }
    throw error
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
