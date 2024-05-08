import customFetch from '../utils/customFetch'

export const fetchGenres = async () => {
  try {
    const response = await customFetch.get(`/genres`)
    return response.data
  } catch (error) {
    throw new Error('Error fetching recently released songs: ' + error.message)
  }
}
