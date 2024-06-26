import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { signup } from '../apis/Authencation';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confimPass, setConfirmPass] = useState("");

    const doSignup = async () => {
        try {
            if (name.length == 0) {
                alert("Bạn hãy nhập tên của bạn");
                return
            }

            if (email.length == 0) {
                alert("Bạn hãy nhập email ");
                return
            }

            if (8 > password.length && password > 32) {
                alert("Mật khẩu phải nằm trong khoảng từ 8 - 32 kí tự");
                return
            }

            if (confimPass !== password) {
                alert("Nhập lại mật khẩu không đúng")
                return
            }
            await signup(name, email, password);
            alert(`Chúc mừng bạn ${name} đã đăng kí thành công`)
            navigation.navigate('AboutScreen')
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
                <View style={styles.container}>
                    <Text style={{ ...styles.header, fontSize: 16, marginTop: 60 }}>LET'S GET YOU STARTED</Text>
                    <Text style={{ ...styles.header, fontSize: 24, fontWeight: "bold", marginTop: 10 }}>Create an Account</Text>
                    <View style={styles.wrapper}>
                        <TextInput placeholder="Your name" style={styles.ip} onChangeText={(text) => setName(text)}></TextInput>
                        <TextInput autoCapitalize='none' placeholder="Email" style={styles.ip} onChangeText={(text) => setEmail(text)}></TextInput>
                        <TextInput autoCapitalize='none' placeholder="Password" style={styles.ip} onChangeText={(text) => setPassword(text)} textContentType="password" secureTextEntry={true}></TextInput>
                        <TextInput autoCapitalize='none' placeholder="Cofirm Password" style={styles.ip} onChangeText={(text) => setConfirmPass(text)} textContentType="password" secureTextEntry={true}></TextInput>
                    </View>
                    <View style={styles.btn}>
                        <TouchableOpacity>
                            <Text style={{
                                color: "#fff", fontWeight: "bold", textAlign: "center", paddingVertical: 15,
                                paddingHorizontal: 118,
                            }} onPress={doSignup}>GET STARTED</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: 'center' }}>
                        <Text style={{ marginTop: 10 }}>Already have an account?

                            <Text style={{ color: "#000", fontWeight: "bold", textDecorationLine: "underline" }} onPress={() => navigation.navigate('LoginScreen')}> LOGIN HERE</Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView >
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
        marginTop: 80
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
        marginTop: 15,
        backgroundColor: "#000",
        borderRadius: 10
    }
})