import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker'
import { BasicIP } from '../constant/Constants'

const User = ({ navigation }) => {
  const [token, setToken] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [newName, setNewName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangePassword, setIsChangePassword] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token')
      if (token) {
        setToken(token)

        const response = await fetch(`${BasicIP}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const userData = await response.json()
        setName(userData.name)
        setEmail(userData.email)
        setAvatar(userData.photo)
      } else {
        Alert.alert('Token not found')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChangePassword = async () => {
    try {
      // Kiểm tra xác nhận mật khẩu mới
      if (newPassword !== confirmPassword) {
        Alert.alert('Mật khẩu mới và xác nhận mật khẩu không khớp')
        return
      }

      // Gọi API để xác nhận mật khẩu cũ và cập nhật mật khẩu mới
      const token = await SecureStore.getItemAsync('token')
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
      })

      if (response.ok) {
        Alert.alert('Đổi mật khẩu thành công')
      } else {
        const errorData = await response.json()
        Alert.alert(
          'Đổi mật khẩu thất bại',
          errorData.message || 'Có lỗi xảy ra'
        )
      }
    } catch (error) {
      console.error('Error:', error)
      Alert.alert('Có lỗi xảy ra khi đổi mật khẩu')
    } finally {
      setIsChangePassword(false)
    }
  }

  const handleIsChangePassword = async () => {
    setIsChangePassword(true)
  }

  const updateUserProfile = async () => {
    const token = await SecureStore.getItemAsync('token')
    try {
      const formData = new FormData()

      if (newName && newName.trim().length !== 0) {
        formData.append('name', newName)
      }

      if (photo) {
        formData.append('photoFile', {
          name: 'update-img.jpg',
          uri: photo.uri,
          type: 'image/jpeg',
        })
      }

      await fetch(`${BasicIP}/users/profile/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleImageSelection = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access media library denied')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      console.log('Image picker result:', result) // Log the entire result object

      if (!result.cancelled && result.assets.length > 0) {
        const selectedImage = result.assets[0]
        // console.log('Selected image URI:', selectedImage.uri)
        console.log(selectedImage)
        setPhoto(selectedImage)
      } else {
        console.log('Image selection cancelled or URI is undefined')
      }
    } catch (error) {
      console.error('Error selecting image:', error)
    }
  }

  const handleEditProfile = async () => {
    setIsEditingProfile(true) // Enable editing again
  }

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token')
    navigation.navigate('HomeScreen')
  }

  return (
    <View style={styles.container}>
      {/* <FontAwesome name="pencil-square-o" size={24} color="#fff" /> */}

      {isEditingProfile ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <TextInput
            placeholder="Enter your name"
            value={newName}
            onChangeText={setNewName}
            style={{
              marginBottom: 20,
              padding: 10,
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 5,
              width: 300,
              color: '#fff',
            }}
          />
          {photo && (
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 200, height: 200, marginBottom: 20 }}
            />
          )}
          <Button title="Select Photo" onPress={handleImageSelection} />
          <Button
            title="Update Profile"
            onPress={() => updateUserProfile()}
            disabled={!newName && !photo}
          />
          <TouchableOpacity onPress={() => setIsEditingProfile(false)}>
            <Text style={{ color: '#fff', paddingLeft: '90%', paddingTop: 10 }}>
              Hủy
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.wrapper}>
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />

            <View style={{ flexDirection: 'column' }}>
              <Text style={{ ...styles.text, fontSize: 20, paddingTop: 4 }}>
                {name}
              </Text>

              <Text style={{ ...styles.text, opacity: 0.6, paddingTop: 4 }}>
                {email}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleEditProfile}>
            <Text style={styles.btnText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>
      )}
      {isChangePassword ? (
        <View>
          <View style={styles.wrapper}>
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />

            <View style={{ flexDirection: 'column' }}>
              <Text style={{ ...styles.text, fontSize: 20, paddingTop: 4 }}>
                {name}
              </Text>

              <Text style={{ ...styles.text, opacity: 0.6, paddingTop: 4 }}>
                {email}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
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
              <Text
                style={{ color: '#fff', paddingLeft: '90%', paddingTop: 10 }}
              >
                Hủy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
              <Text style={styles.btnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <TouchableOpacity style={styles.btn} onPress={handleIsChangePassword}>
            <Text style={styles.btnText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A071E',
    padding: 20,
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  text: {
    color: '#fff',
    paddingHorizontal: 10,
  },
  btn: {
    marginTop: 15,
    backgroundColor: '#0A071E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#0A071E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
  },
})

export default User
