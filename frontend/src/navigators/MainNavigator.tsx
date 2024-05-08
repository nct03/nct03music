import { Ionicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Player, Favorite, User, HomeScreen, SearchResultScreen, SongScreen } from '../screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


export const BottomNavigator = () => {
  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          position: "absolute",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#3c25d3'
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ color }) => (<Ionicons name="home-outline" size={24} color={color} />)
      }} />
      <Tab.Screen name="Player" component={Player} options={{
        tabBarIcon: ({ color }) => (<Feather name="music" size={24} color={color} />)
      }} />
      <Tab.Screen name="Favorite" component={Favorite} options={{
        tabBarIcon: ({ color }) => (<MaterialIcons name="favorite-border" size={24} color={color} />)
      }} />
      <Tab.Screen name="User" component={User} options={{
        tabBarIcon: ({ color }) => (<AntDesign name="user" size={24} color={color} />)
      }} />
    </Tab.Navigator >
  )
}

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
      <Stack.Screen name="HomeScreen" component={BottomNavigator} />
      <Stack.Screen name="SongScreen" component={SongScreen} />
    </Stack.Navigator>
  );
}
export default MainNavigator