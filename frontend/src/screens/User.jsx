import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { BasicIP } from '../constant/Constants';

const User = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

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
        setAvatar(userData.photo);
      } else {
        Alert.alert('Token not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleChangePassword = async () => {
    try {
      // Kiểm tra xác nhận mật khẩu mới
      if (newPassword !== confirmPassword) {
        Alert.alert('Mật khẩu mới và xác nhận mật khẩu không khớp');
        return;
      }

      // Gọi API để xác nhận mật khẩu cũ và cập nhật mật khẩu mới
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
        Alert.alert('Đổi mật khẩu thành công');
      } else {
        const errorData = await response.json();
        Alert.alert('Đổi mật khẩu thất bại', errorData.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsChangePassword(false);
    }
  };

  const handleIsChangePassword = async () => {
    setIsChangePassword(true)
  }

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('photoFile', avatar);

      const response = await fetch(`${BasicIP}/users/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Profile updated successfully');

      } else {
        const errorData = await response.json();
        Alert.alert('Failed to update profile', errorData.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred while updating profile');
    }
  };

  const handleEditProfile = async () => {
    setIsEditingProfile(false); // Disable editing temporarily during API call
    await updateUserProfile();
    setIsEditingProfile(true); // Enable editing again
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('HomeScreen')
  }

  return (
    <View style={styles.container}>
      {/* <FontAwesome name="pencil-square-o" size={24} color="#fff" /> */}

      <View style={styles.wrapper}>
        <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 10 }} />

        <View style={{ flexDirection: "column" }}>

          <Text style={{ ...styles.text, fontSize: 20, paddingTop: 4 }}>{name}</Text>

          <Text style={{ ...styles.text, opacity: 0.6, paddingTop: 4 }}>{email}</Text>
        </View>
      </View>


      {isChangePassword ? (
        <View style={{ flexDirection: "column", marginTop:10 }}>
          {/* <Text style={styles.label}>Mật khẩu cũ: </Text> */}
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu cũ"
            placeholderTextColor="#fff"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
          {/* <Text style={styles.label}>Mật khẩu mới</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="#fff"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          {/* <Text style={styles.label}>Xác nhận mật khẩu mới</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={() => setIsChangePassword(false)}>
            <Text style={{ color: "#fff", paddingLeft: "90%", paddingTop: 10 }}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
            <Text style={styles.btnText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      ) : (

        <TouchableOpacity style={styles.btn} onPress={handleIsChangePassword}>
          <Text style={styles.btnText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View >
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
    marginTop: 10
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
    backgroundColor: "#0A071E",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#fff",
    color: "#fff"
  }
});

export default User;
