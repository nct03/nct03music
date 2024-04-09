import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, AsyncStorage, Alert } from 'react-native';

const UserScreen = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);

        const response = await fetch('http://${IP}:8080/v1/users/profile', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const userData = await response.json();
        setName(userData.name);
        setEmail(userData.email);
        // Load avatar from the API
        setAvatar(userData.photo);
      } else {
        // Redirect to login or display message
        Alert.alert('Token not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch('https://your-api-url/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('User updated successfully');
      } else {
        Alert.alert('Failed to update user', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const changePassword = async () => {
    try {
      const response = await fetch('https://your-api-url/changePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Password changed successfully');
      } else {
        Alert.alert('Failed to change password', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const changeAvatar = async () => {
    // Implement logic to change avatar
  };

  return (
    <View>
      <Image source={{ uri: avatar }} style={{ width: 100, height: 100 }} />
      <Button title="Change Avatar" onPress={changeAvatar} />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Update" onPress={updateUser} />

      <TextInput
        placeholder="New Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Change Password" onPress={changePassword} />
    </View>
  );
};

export default UserScreen;
