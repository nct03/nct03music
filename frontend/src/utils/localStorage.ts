import AsyncStorage from '@react-native-async-storage/async-storage'
import { JWToken } from '../models'

export const saveTokenToStorage = async (token: JWToken) => {
  try {
    await AsyncStorage.setItem('token', JSON.stringify(token))
  } catch (error) {
    console.log('Error saving token to AsyncStorage:', error)
  }
}

export const getTokenFromStorage = async (): Promise<JWToken> => {
  try {
    const data = await AsyncStorage.getItem('token')
    if (data) {
      const token = JSON.parse(data)
      return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    }
    return null
  } catch (error) {
    console.log('Error checking token in AsyncStorage:', error)
    return null
  }
}

export const removeTokenFromStorage = async () => {
  await AsyncStorage.removeItem('token')
}
