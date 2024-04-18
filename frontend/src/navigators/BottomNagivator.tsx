// import { View ,StyleSheet} from 'react-native';
import { Ionicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { HomeScreen, LoginScreen, SignupScreen, Player, Favorite, User, AboutScreen, SearchResultScreen, SongScreen } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';

 
export const BottomNavigator = () => {
    const Tab = createBottomTabNavigator()
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0A071E',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }}
            >
            <Tab.Screen name="About" component={AboutScreen} options={{
                tabBarIcon: () => (<Ionicons name="home-outline" size={24} color={"#fff"}  />)
            }} />
            <Tab.Screen name="Player" component={Player} options={{
                tabBarIcon: () => (<Feather name="music" size={24} color={"#fff"} />)
            }} />
            <Tab.Screen name="Favorite" component={Favorite} options={{
                tabBarIcon: () => (<MaterialIcons name="favorite-border" size={24} color={"#fff"} />)
            }} />
            <Tab.Screen name="User" component={User} options={{
                tabBarIcon: () => (<AntDesign name="user" size={24} color="#fff" />)
            }} />
        </Tab.Navigator >
    )
}

const AboutNavigator = () => {
    const Stack = createNativeStackNavigator();
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
                <Stack.Screen name="SearchResultScreen" component={SearchResultScreen}/>
                <Stack.Screen name="AboutScreen" component={BottomNavigator} options={{ title: 'Trang chủ' }} /> 
                <Stack.Screen name="SongScreen" component={SongScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default AboutNavigator