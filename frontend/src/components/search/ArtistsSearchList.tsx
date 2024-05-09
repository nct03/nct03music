import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useDispatch } from "react-redux"
import { fetchSongs } from "../../redux/songsSlice"
import { AppDispatch } from "../../redux/store"
import { useNavigation } from "@react-navigation/native"

const ArtistsSearchList = ({ artistsSearchResult }) => {

  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()

  if (!artistsSearchResult || artistsSearchResult.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>No Artists Found</Text>
      </View>
    )
  };

  const handleGetSongsOfArtist = async (id: number, aritstName: string) => {
    // try {
    //   const songResults = await getSongsOfArtist(id)
    //   const favoriteSongs = songResults.items
    //   navigation.navigate('SongScreen', { favoriteSongs })
    // } catch (error) {
    //   console.error(error.message)
    // }

    dispatch(fetchSongs({ url: `/artists/${id}/songs`, heading: aritstName }))
    navigation.navigate('SongScreen')
  }

  return (
    <>
      {artistsSearchResult.map((artist) => (
        <TouchableOpacity
          style={styles.item}
          key={artist.id}
          onPress={() => handleGetSongsOfArtist(artist.id, artist.name)}
        >
          <Image source={{ uri: artist.photo }} style={styles.image} />
          <Text style={styles.text}>{artist.name}</Text>
        </TouchableOpacity>
      ))}
    </>
  )

}
export default ArtistsSearchList

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
})