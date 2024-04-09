// import { View ,StyleSheet} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

// export default function BottomNavigator ({navigation}) {
//     return (
//         <View style={{flexDirection: "row", alignItems:"flex-end", alignContent:"flex-end", justifyContent: "space-around", marginTop:226, backgroundColor:"#0A071E"}}>
//             <Ionicons name="home-outline" size={24} color="#fff" padding={10} onPress={() => navigation.navigate('AboutScreen')}/>
//             <Feather name="music" size={24} color="#fff" padding={10} onPress={() => navigation.navigate('Player')} />
//             <MaterialIcons name="favorite-border" size={24} color="#fff" padding={10} onPress={() => navigation.navigate('Favorite')} />
//         </View>
//     )
// }

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AboutScreen, Player, Favorite } from "../screens";

const Tab = createBottomTabNavigator()

const BottomNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="AboutScreen" component={AboutScreen} options={{
                tabBarIcon: () => (<Ionicons name="home-outline" size={24} color="#fff" padding={10} />)
            }} />
            <Tab.Screen name="Player" component={Player} options={{
                tabBarIcon: () => (<Feather name="music" size={24} color="#fff" padding={10} />)
            }} />
            <Tab.Screen name="Favorite" component={Favorite} options={{
                tabBarIcon: () => (<MaterialIcons name="favorite-border" size={24} color="#fff" padding={10} />)
            }} />
        </Tab.Navigator>
    )
}

export default BottomNavigator