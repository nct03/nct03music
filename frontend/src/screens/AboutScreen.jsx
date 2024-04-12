import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, TextInput, Button, TouchableOpacity, ScrollView } from "react-native";
import * as SecureStore from 'expo-secure-store';
// import BottomNavigator from "../components/BottomNagivator";
import { IP } from "../constant/Constants";
import { EvilIcons } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
  const [musicList, setMusicList] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  // const [noResults, setNoResults] = useState(false);
  const [singers, setSingers] = useState([]);


  useEffect(() => {
    checkToken()
    fetchMusicList();
    fetchSingers();
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

  const fetchSingers = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      setLoading(true); // Start loading indicator
      const response = await fetch(`http://${IP}:8080/v1/artists?pageNum=1&pageSize=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSingers(data);
    } catch (error) {
      console.error('Error fetching top singers:', error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const fetchMusicList = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
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

  return (
    <ScrollView style={styles.background} >

      <View style={styles.container}>

        <View style={styles.input}>
          <View style={{ flexDirection: "row", borderColor: "#fff", borderWidth: 1, borderRadius: 20, width: 360, alignSelf: "center" }}>
            <TouchableOpacity>
              <EvilIcons name="search" size={28} color="#fff" padding={10} />
            </TouchableOpacity>
            <TextInput autoCapitalize='none' placeholder="Nhập tên bài hát hoặc ca sĩ" placeholderTextColor="#fff" style={{
              padding: 10, paddingLeft: -5, color: "#fff"
            }} />
          </View>
        </View>

        <View style={styles.artist}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}> Nghệ sĩ tiêu biểu: </Text>
          <FlatList
            horizontal
            data={singers.items}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ ...styles.wrapperCol, alignItems: "center" }}>
                <Image
                  source={{ uri: item.photo }}
                  style={{ width: 100, height: 100, borderRadius: 10, margin: 10 }}
                />
                <Text style={{ ...styles.text, fontSize: 12, }}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <View>

          <TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 10 }}> Thể loại: </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ color: "#fff", margin: 10 }}>Rock</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ color: "#fff", margin: 10 }}>Pop</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ color: "#fff", margin: 10 }}>US - UK</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ color: "#fff", margin: 10 }}>Jazz</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentlyRelease}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}> Top bảng xếp hạng được ưa thích: </Text>
          <FlatList
            data={musicList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.wrapper}>
                <Image
                  source={{ uri: item.imagePath }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
                <View style={styles.childWrapper}>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text style={styles.text}>{item.artists[0].name}</Text>
                  <Text style={styles.text}>Ngày phát hành: {item.releasedOn}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  background: {
    backgroundColor: "#0A071E"
  },

  container: {
    marginTop: 20,
    width: 380,
    alignSelf: 'center',
  },

  search: {
    marginTop: 10,
    maxHeight: 200,
  },

  artist: {
    marginTop: 10
  },

  wrapperCol: {
    flexDirection: "column"
  },

  recentlyRelease: {
    marginTop: 20,
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
    paddingTop: 10,
    color: "#fff"
  }
  , text: {
    color: "#fff"
  }
})




