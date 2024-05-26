import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { EvilIcons, Ionicons } from '@expo/vector-icons'
import { getSongsOfArtist } from '../apis/MusicApi'
import TabButton from '../components/TabButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../features/store'
import { setSearchArtist, setSearchSong } from '../features/slices/searchSlice'
import { searchSongs } from '../apis/songService'
import { searchArtists } from '../apis/artistService'
import SearchBar from '../components/SearchBar'
import Loading from '../components/Loading'
import ArtistsSearchList from '../components/search/ArtistsSearchList'
import SongsSearchList from '../components/search/SongsSearchList'

const SearchResultScreen = ({ route, navigation }) => {
  const [newSongResults, setNewSongResults] = useState([])
  const [newArtistResults, setNewArtistResults] = useState([])
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()

  const { keyword, isSearchSong } = useSelector(
    (state: RootState) => state.search
  )

  const handleSearch = async () => {
    setLoading(true)
    try {
      if (isSearchSong) {
        const songsResponse = await searchSongs(keyword)
        setNewSongResults(songsResponse)
      } else {
        const artistsResponse = await searchArtists(keyword)
        setNewArtistResults(artistsResponse)
      }
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    handleSearch()
  }, [keyword, isSearchSong])

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 10, marginTop: 24 }}>
          <SearchBar initKeyword={keyword} />
          <View style={styles.buttonContainer}>
            <TabButton
              title="Songs"
              isActive={isSearchSong}
              onPress={() => dispatch(setSearchSong())}
            />
            <TabButton
              title="Artists"
              isActive={!isSearchSong}
              onPress={() => dispatch(setSearchArtist())}
            />
          </View>
        </View>

        {loading && <Loading />}
        {!loading && (
          <View style={styles.section}>
            {isSearchSong ? (
              <SongsSearchList songsSearchResult={newSongResults} />
            ) : (
              <ArtistsSearchList artistsSearchResult={newArtistResults} />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A071E',
    flex: 1,
    padding: 20,
    marginTop: '6%',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
})

export default SearchResultScreen
