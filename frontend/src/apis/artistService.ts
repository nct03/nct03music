import { Alert } from 'react-native'
import { Artist, PageableResponse, Song } from '../models'
import customFetch from '../utils/customFetch'
import { getErrorMsg, returnError } from '../utils/errorHelper'

export const getArtists = async () => {
  try {
    const response = await customFetch.get(`/artists`)
    return response.data
  } catch (error) {
    returnError(error)
  }
}

export const getArtistSongs = async (
  artistId: number,
  pageNum: number,
  pageSize: number
): Promise<PageableResponse<Song>> => {
  try {
    const response = await customFetch.get<PageableResponse<Song>>(
      `/artists/${artistId}/songs`,
      { params: { pageNum, pageSize } }
    )
    return response.data
  } catch (error: any) {
    Alert.alert('Error', getErrorMsg(error))
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
