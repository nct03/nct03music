import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen, LoginScreen, SignupScreen, Player, Favorite, User, AboutScreen } from './src/screens'
import { Ionicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import AboutNavigator from './src/navigators/BottomNagivator';




export default function App() {
    return (
        <AboutNavigator/>
    );
}

