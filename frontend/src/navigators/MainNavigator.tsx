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
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: () => (<Ionicons name="home-outline" size={24} color={"#fff"} />)
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

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
      <Stack.Screen name="HomeScreen" component={BottomNavigator} options={{ title: 'Trang chủ' }} />
      <Stack.Screen name="SongScreen" component={SongScreen} />
    </Stack.Navigator>
  );
}
export default MainNavigator