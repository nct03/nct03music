import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/auth/authSlice'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('nam@gmail.com')
  const [password, setPassword] = useState('nam12345')

  const { isLoading } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogin = async () => {
    // Kiểm tra đã nhâp password và email hay chưa
    if (email.length == 0) {
      alert('Bạn hãy nhập email ')
      return
    }
    if (8 > password.length && password.length > 32) {
      alert('Mật khẩu phải nằm trong khoảng 8 - 32 kí tự')
      return
    }
    dispatch(loginUser({ email, password }))
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
      >
        <View style={styles.container}>
          <Text style={{ ...styles.header, fontSize: 16, marginTop: 60 }}>
            WELLCOME BACK
          </Text>
          <Text
            style={{
              ...styles.header,
              fontSize: 24,
              fontWeight: 'bold',
              marginTop: 10,
            }}
          >
            LOGIN into your account
          </Text>
          <View style={styles.wrapper}>
            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              style={styles.ip}
              value={email}
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
              autoCapitalize="none"
              placeholder="Password"
              style={styles.ip}
              value={password}
              onChangeText={(text) => setPassword(text)}
              textContentType="password"
              secureTextEntry={true}
            ></TextInput>
          </View>
          <View style={[
            styles.btn,
            { opacity: isLoading ? .7 : 1 }
          ]}>
            <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  paddingVertical: 15,
                  paddingHorizontal: 118,
                }}
              >
                {!isLoading ? 'LOGIN' : 'SENDING...'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginTop: 10 }}>
              New User?
              <Text
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                }}
                onPress={() => navigation.navigate('SignupScreen')}
              >
                {' '}
                SIGN UP HERE
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  header: {
    color: '#000',
  },
  wrapper: {
    marginTop: 160,
  },
  ip: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  btn: {
    marginTop: 30,
    backgroundColor: '#000',
    borderRadius: 10,
  },
})
