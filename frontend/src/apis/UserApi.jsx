import * as SecureStore from 'expo-secure-store';
import { BasicIP } from '../constant/Constants';


export const fetchUserData = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      const response = await fetch(`${BasicIP}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      return userData;
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`${BasicIP}/users/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: oldPassword,
        newPassword: newPassword,
        confirmationPassword: confirmPassword,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Change password failed');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateProfile = async (newName, photo) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const formData = new FormData();

    if (newName && newName.trim().length !== 0) {
      formData.append('name', newName);
    }

    if (photo) {
      formData.append('photoFile', {
        name: 'update-img.jpg',
        uri: photo.uri,
        type: 'image/jpeg',
      });
    }

    await fetch(`${BasicIP}/users/profile/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
