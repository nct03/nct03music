import { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'

import { getSongsOfArtist, getSongsOfGenre } from '../apis/MusicApi'
import { fetchSingers, searchArtists } from '../apis/artists'
import { fetchRecentlySongs, searchSongs } from '../apis/songs'
import { fetchGenres } from '../apis/genres'
import Loading from '../components/Loading'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { setKeyword } from '../redux/searchSlice'
import SearchBar from '../components/SearchBar'
import { fetchSongs } from '../redux/songsSlice'
import { setSongsPlay } from '../redux/playerSlice'

export default function HomeScreen({ navigation }) {
  const [musicList, setMusicList] = useState([])
  const [singers, setSingers] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const [singersData, musicListData, genresData] = await Promise.all([
        fetchSingers(),
        fetchRecentlySongs(),
        fetchGenres(),
      ])
      setSingers(singersData)
      setMusicList(musicListData)
      setGenres(genresData)
    } catch (error) {
      Alert.alert('Error fetching initial data:', error.message)
    }
    setLoading(false)
  }



  const handleGetSongsOfArtist = async (id: number, artistName: string) => {
    dispatch(fetchSongs({ url: `/artists/${id}/songs`, heading: artistName }))
    navigation.navigate('SongScreen')
  }

  const handleGetSongsOfGenre = async (id: number, genreName: string) => {
    dispatch(fetchSongs({ url: `/genres/${id}/songs`, heading: genreName }))
    navigation.navigate('SongScreen')
  }

  const handleSongPress = (songData, currentIndex) => {
    dispatch(setSongsPlay({ songs: songData, currentIndex }))
    navigation.navigate('Player')
  }

  if (loading) {
    return <Loading style={{ backgroundColor: 'black' }} />
  }

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <SearchBar initKeyword='' />

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
                onPress={() => handleGetSongsOfArtist(item.id, item.name)}
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
                onPress={() => handleGetSongsOfGenre(item.id, item.name)}
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
              key={item.id}
              style={styles.wrapper}
              onPress={() => handleSongPress(musicList, index)}
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
    width: 400,
    alignSelf: 'center',
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 30,
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
