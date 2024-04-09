import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, TextInput, Button } from "react-native";
import * as SecureStore from 'expo-secure-store';
// import BottomNavigator from "../components/BottomNagivator";
import { IP } from "../constant/Constants";

export default function AboutScreen({ navigation }) {
  const [musicList, setMusicList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    checkToken()
    fetchMusicList();
  }, []);

  const checkToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setToken(token);
      } else {
        // Redirect to login or display message
        Alert.alert('Token not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchMusicList = async () => {
    try {
      setLoading(true); // Start loading indicator
      const response = await fetch(`http://${IP}:8080/v1/songs/recently`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMusicList(data);
    } catch (error) {
      console.error('Error fetching recently released songs:', error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };




  const searchMusic = async () => {
    try {
      setLoading(true); // Bắt đầu hiển thị loading indicator
      let response;
      if (searchTerm.includes('by:')) {
        // Tìm theo tên ca sĩ
        const artist = searchTerm.split('by:')[1].trim();
        response = await fetch(`http://${IP}:8080/v1/songs/search?artist=${artist}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Tìm theo từ khóa hoặc tên ca sĩ
        response = await fetch(`http://${IP}:8080/v1/songs/search?keyword=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      const data = await response.json();
      if (data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    } finally {
      setLoading(false); // Kết thúc hiển thị loading indicator
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        < TextInput
          placeholder="Tìm kiếm bài hát hoặc ca sĩ"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        < Button title="Tìm kiếm" onPress={searchMusic} />

        {
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : noResults ? (
            <Text>Không có kết quả phù hợp với từ khóa tìm kiếm</Text>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <View style={styles.wrapper} >
                  <Image
                    source={{ uri: item.imagePath }}
                    style={{ width: 60, height: 60 }}
                  />
                  <View style={styles.childWrapper}>
                    <Text>Ca sĩ: {item.artists[0].name}</Text>
                    <Text>Bài hát: {item.name}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}

      </View>

      <View style={styles.recentlyRelease}>
        <Text> Recently Released Song: </Text>
        <FlatList
          data={musicList}
          renderItem={({ item }) => (
            <View style={styles.wrapper}>
              <Image
                source={{ uri: item.imagePath }}
                style={{ width: 100, height: 100 }}
              />
              <View style={styles.childWrapper}>
                <Text>{item.name}</Text>
                <Text>{item.artists[0].name}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 380,
    alignSelf: 'center',
  },

  search: {
    marginTop:10,
    maxHeight: 200,
  },
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
    flexDirection: "column",
    paddingLeft: 10,
    paddingTop:10,
  }
})




