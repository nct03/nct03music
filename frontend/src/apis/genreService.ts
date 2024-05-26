import customFetch from '../utils/customFetch'

export const getGenres = async () => {
  try {
    const response = await customFetch.get(`/genres`)
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      return
    }
    throw error
  }
}
