import { View ,StyleSheet} from 'react-native';
import { Ionicons, Feather, MaterialIcons   } from '@expo/vector-icons';

export default function BottomNavigator ({navigation}) {
    return (
        <View style={{flexDirection: "row", alignItems:"flex-end", alignContent:"flex-end", justifyContent: "space-around", marginTop:226, backgroundColor:"#0A071E"}}>
            <Ionicons name="home-outline" size={24} color="#fff" padding={10} onPress={() => navigation.navigate('AboutScreen')}/>
            <Feather name="music" size={24} color="#fff" padding={10} onPress={() => navigation.navigate('Player')} />
            <MaterialIcons name="favorite-border" size={24} color="#fff" padding={10} onPress={() => navigation.navigate('Favorite')} />
        </View>
    )
}
