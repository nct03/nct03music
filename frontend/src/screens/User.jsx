import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { BasicIP } from '../constant/Constants';

const User = ({navigation}) => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setToken(token);

        const response = await fetch(`${BasicIP}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleChangePassword = () => {
    // Implement password change logic
    console.log('Change password clicked');
  };

  const handleChooseAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  const handleLogout = async () =>{
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('HomeScreen')
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 10 }} />
        </TouchableOpacity>
        <View style={{ flexDirection: "column" }}>
          {isEditingProfile ? (
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={name}
              onChangeText={setName}
            />
          ) : (
            <Text style={{ ...styles.text, fontSize: 20, paddingTop: 4 }}>{name}</Text>
          )}
          <Text style={{ ...styles.text, opacity: 0.6, paddingTop: 4 }}>{email}</Text>
        </View>
      </View>
      {isEditingProfile ? (
        <TouchableOpacity style={styles.btn} onPress={handleEditProfile}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleEditProfile}>
          <Text style={styles.btnText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
        <Text style={styles.btnText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A071E",
    padding: 20
  },
  wrapper: {
    flexDirection: "row",
    marginTop: 20
  },
  text: {
    color: "#fff",
    paddingHorizontal: 10
  },
  btn: {
    marginTop: 15,
    backgroundColor: "#0A071E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center"
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 4
  }
});

export default User;
