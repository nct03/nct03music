import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import BottomNavigator from "../components/BottomNagivator";

export default function AboutScreen({ navigation }) {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusicList = async () => {
      try {
        const response = await fetch('http://192.168.100.177:8080/v1/songs/recently');
        const data = await response.json();
        setMusicList(data);
      } catch (error) {
        console.error('Error fetching music list:', error);
      } finally {
        setLoading(false); // Set loading state to false when data fetching is complete
      }
    };

    fetchMusicList();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Recently Released Song: </Text>
      <FlatList
        data={musicList}
        renderItem={({ item }) => (
          <View style={styles.wrapper}>
            <Image
              source={{ uri: item.imagePath }}
              style={{ width: 100, height: 100, backgroundColor: "#000" }}
              onLoad={() => console.log('Image loaded successfully')}
              onError={(error) => console.error('Image loading error:', error)}
            />
            <View style={styles.childWrapper}>
              <Text>{item.name}</Text>
              <Text>{item.artists[0].name}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
        <BottomNavigator />
      
    </View>
  );
}

const styles = StyleSheet.create({
  recentlyRelease: {
    marginTop: 20
  }
  , wrapper: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20
  }
  , childWrapper: {
    flex: 1,
    flexDirection: "column"
  }
})