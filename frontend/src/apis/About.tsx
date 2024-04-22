import * as SecureStore from 'expo-secure-store';
import { BasicIP } from "../constant/Constants";

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

export const fetchSingers = async () => {
  try {
    const token = await checkToken();
    const response = await fetch(`${BasicIP}/artists?pageNum=1&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching top singers: ' + error.message);
  }
};

export const fetchMusicList = async () => {
  try {
    const token = await checkToken();
    const response = await fetch(`${BasicIP}/songs/recently`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching recently released songs: ' + error.message);
  }
};

export const fetchGenres = async () => {
  try {
    const token = await checkToken();
    const response = await fetch(`${BasicIP}/genres`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching recently released songs: ' + error.message);
  }
};

export const searchSongs = async (keyword) => {
    try {
      const token = await checkToken();
      const response = await fetch(`${BasicIP}/songs/search?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error searching songs: ' + error.message);
    }
  };
  
  export const searchArtists = async (keyword) => {
    try {
      const token = await checkToken();
      const response = await fetch(`${BasicIP}/artists/search?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error searching artists: ' + error.message);
    }
  };