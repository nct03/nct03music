import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { IP } from '../constant/Constants';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // Kiểm tra đã nhâp password và email hay chưa 
        if (email.length == 0) {
            alert("Bạn hãy nhập email ");
            return
        }
        if (8 > password.length && password > 32) {
            alert("Mật khẩu phải nằm trong khoảng 8 - 32 kí tự");
            return
        }
        try {
            const response = await fetch(`http://${IP}:8080/v1/auth/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                // Save token to AsyncStorage or SecureStore
                console.log("Ok");
                await SecureStore.setItemAsync('token', data.token);
                navigation.navigate('AboutScreen'); // Navigate to Home screen on successful login
            } else {
                // Handle error
                alert('Login failed:' + data.errors[0]);
                console.log(data.errors[0]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // useEffect(() => {
    //     handleLogin()
    // }, [])

    // const loginAPi = (email, password) => {
    //     return axios.post('http://192.168.100.177:8080/v1/auth/authenticate', { email, password });
    // }

    // const handleLogin = async () => {


    //     let res = await loginAPi(email, password);
    //     if (res && res.token) {
    //         alert("token", res.token)
    //         navigation.navigate('DangNhapThanhCong')
    //     }

    // let urlCheckLogin = "https://660bdd483a0766e85dbcbb9c.mockapi.io/account/account?email=" + email;

    // //Thực hiện lấy dữ liệu
    // fetch(urlCheckLogin)
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then(async (res_login) => {
    //         if (res_login.length != 1) {
    //             alert("Email của bạn nhập đã bị sai");
    //             return
    //         }
    //         else {
    //             let objUser = res_login[0];
    //             if (objUser.password != password) {
    //                 alert("sai mật khẩu");
    //                 return
    //             }
    //             else {
    //                 //Đúng password lưu vào storage
    //                 try {
    //                     // await AsyncStorage.setItem('loginInfo', JSON.stringify(objUser));
    //                     navigation.navigate('DangNhapThanhCong')
    //                 } catch (error) {
    //                     alert(error)
    //                 }
    //             }
    //         }
    //     })
    // }

    // useEffect(() => {
    //     let token = AsyncStorage.getItem("token");
    //     if (token) {
    //         navigation.navigate('DangNhapThanhCong')
    //     }
    // }, [])

    return (
        <View style={styles.container}>
            <Text style={{ ...styles.header, fontSize: 16, marginTop: 60 }}>WELLCOME BACK</Text>
            <Text style={{ ...styles.header, fontSize: 24, fontWeight: "bold", marginTop: 10 }}>LOGIN into your account</Text>
            <View style={styles.wrapper}>
                <TextInput autoCapitalize='none' placeholder="Email" style={styles.ip} onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput autoCapitalize='none' placeholder="Password" style={styles.ip} onChangeText={(text) => setPassword(text)} textContentType="password" secureTextEntry={true}></TextInput>
            </View>
            <View style={styles.btn} >
                <TouchableOpacity>
                    <Text style={{
                        color: "#fff", fontWeight: "bold", textAlign: "center", paddingVertical: 15,
                        paddingHorizontal: 118,
                    }} onPress={handleLogin}>LOGIN</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 240, justifyContent: "center", alignItems: 'center', justifyContent: 'center', }}>
                <Text style={{ marginTop: 10 }}>New User?
                    <Text style={{ color: "#000", fontWeight: "bold", textDecorationLine: "underline" }} onPress={() => navigation.navigate('SignupScreen')}> SIGN UP HERE</Text>
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
    },
    header: {
        color: "#000",
    },
    wrapper: {
        marginTop: 160
    },
    ip: {
        marginTop: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "grey",
    },
    btn: {
        marginTop: 30,
        backgroundColor: "#000",
        borderRadius: 10
    }

})