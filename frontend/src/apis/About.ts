import * as SecureStore from 'expo-secure-store';
import { BasicIP } from "../constant/Constants";
import customFetch from '../utils/customFetch';

export const checkToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }
    return token;
  } catch (error) {
    throw new Error('Error fetching token: ' + error.message);
  }
};




