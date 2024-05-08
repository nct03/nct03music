import { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { EvilIcons } from '@expo/vector-icons'
import {
  fetchMusicList,
  fetchSingers,
  searchSongs,
  searchArtists,
  fetchGenres,
} from '../apis/About'
import { getSongsOfArtist, getSongsOfGenre } from '../apis/MusicApi'

export default function HomeScreen({ navigation }) {
  const [musicList, setMusicList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [singers, setSingers] = useState([])
  const [genres, setGenres] = useState([])

  // useEffect(() => {
  //   fetchInitialData()
  // }, [])

  // const fetchInitialData = async () => {
  //   try {
  //     const singersData = await fetchSingers()
  //     const musicListData = await fetchMusicList()
  //     const genresData = await fetchGenres()
  //     setSingers(singersData)
  //     setMusicList(musicListData)
  //     setGenres(genresData)
  //     setLoading(false)
  //   } catch (error) {
  //     console.error('Error fetching initial data:', error.message)
  //   }
  // }

  const handleSearch = async () => {
    try {
      const songResults = await searchSongs(searchTerm)
      const artistResults = await searchArtists(searchTerm)
      navigation.navigate('SearchResultScreen', { songResults, artistResults })
    } catch (error) {
      console.error('Error searching:', error.message)
    }
  }

  const handleGetSongsOfArtist = async (id) => {
    try {
      const songResults = await getSongsOfArtist(id)
      const favoriteSongs = songResults.items
      navigation.navigate('SongScreen', { favoriteSongs })
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleGetSongsOfGenre = async (id) => {
    try {
      const songResults = await getSongsOfArtist(id)
      const favoriteSongs = songResults.items
      navigation.navigate('SongScreen', { favoriteSongs })
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleSongPress = (songData) => {
    navigation.navigate('Player', { songData })
  }

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              borderColor: '#fff',
              borderWidth: 1,
              borderRadius: 20,
              width: 360,
              alignSelf: 'center',
            }}
          >
            <TouchableOpacity onPress={handleSearch}>
              <EvilIcons name="search" size={28} color="#fff" padding={10} />
            </TouchableOpacity>
            <TextInput
              autoCapitalize="none"
              placeholder="Search songs or artists"
              placeholderTextColor="#fff"
              style={{ padding: 10, paddingLeft: -5, color: '#fff' }}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        <View style={styles.title}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {' '}
            Nghệ sĩ tiêu biểu{' '}
          </Text>
          <FlatList
            horizontal
            data={singers.items}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => handleGetSongsOfArtist(item.id)}
              >
                <Image
                  source={{ uri: item.photo }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    margin: 10,
                  }}
                />
                <Text style={{ ...styles.text, fontSize: 12 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <View style={styles.title}>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 10,
            }}
          >
            {' '}
            Thể loại{' '}
          </Text>

          <FlatList
            horizontal
            data={genres}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => handleGetSongsOfGenre(item.id)}
              >
                <Image
                  source={require('../assets/TheLoai.png')}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    margin: 10,
                  }}
                />
                <Text
                  style={{
                    ...styles.text,
                    position: 'absolute',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 70,
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <View style={styles.title}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {' '}
            Top bảng xếp hạng được ưa thích{' '}
          </Text>
          {musicList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wrapper}
              onPress={() => handleSongPress(item)}
            >
              <Image
                source={{ uri: item.imagePath }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
              <View style={styles.childWrapper}>
                <Text style={{ ...styles.text, fontSize: 20 }}>
                  {item.name}
                </Text>
                <Text style={{ ...styles.text, opacity: 0.6 }}>
                  {item.artists[0].name}
                </Text>
                <Text style={{ ...styles.text, opacity: 0.6 }}>
                  Ngày phát hành: {item.releasedOn}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#0A071E',
    marginTop: '6%',
  },

  container: {
    padding: 20,
    width: 400,
    alignSelf: 'center',
  },

  search: {
    marginTop: 10,
    maxHeight: 200,
  },

  wrapperCol: {
    flexDirection: 'column',
  },

  title: {
    marginTop: 20,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  childWrapper: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 10,
    color: '#fff',
  },
  text: {
    color: '#fff',
  },
})
