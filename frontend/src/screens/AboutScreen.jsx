import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import { fetchMusicList, fetchSingers, searchSongs, searchArtists} from "../apis/About";


export default function AboutScreen({ navigation }) {
  const [musicList, setMusicList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  // const [noResults, setNoResults] = useState(false);
  const [singers, setSingers] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const singersData = await fetchSingers();
      const musicListData = await fetchMusicList();
      setSingers(singersData);
      setMusicList(musicListData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const songResults = await searchSongs(searchTerm);
      const artistResults = await searchArtists(searchTerm);
      navigation.navigate('SearchResultScreen', { songResults, artistResults });
    } catch (error) {
      console.error('Error searching:', error.message);
    }
  };

  return (
    <ScrollView style={styles.background} >

      <View style={styles.container}>

      <View >
        <View style={{ flexDirection: "row", borderColor: "#fff", borderWidth: 1, borderRadius: 20, width: 360, alignSelf: "center" }}>
          <TouchableOpacity onPress={handleSearch}>
            <EvilIcons name="search" size={28} color="#fff" padding={10} />
          </TouchableOpacity>
          <TextInput
            autoCapitalize='none'
            placeholder="Search songs or artists"
            placeholderTextColor="#fff"
            style={{ padding: 10, paddingLeft: -5, color: "#fff" }}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
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
        {musicList.map((item, index) => (
              <TouchableOpacity key={index} style={styles.wrapper}>
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
            ))}
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




