import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, LoginScreen, SignupScreen, AboutScreen, Player, Favorite } from './src/screens'

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='HomeScreen'
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
                <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ title: 'Sign Up' }} />
                <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ title: 'Trang chủ' }} />
                <Stack.Screen name="Player" component={Player} options={{ title: 'Trình phát nhạc' }} />
                <Stack.Screen name="Favorite" component={Favorite} options={{ title: 'Danh sách yêu thích' }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

