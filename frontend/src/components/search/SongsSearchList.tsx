import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const SongsSearchList = ({ songsSearchResult }) => {

  // const handleGetSongsOfArtist = async (id) => {
  //   try {
  //     const songResults = await getSongsOfArtist(id)
  //     const favoriteSongs = songResults.items
  //     navigation.navigate('SongScreen', { favoriteSongs })
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // }

  if (!songsSearchResult || songsSearchResult.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>No Songs Found</Text>
      </View>
    )
  };

  return (
    <>
      {songsSearchResult.map((song) => {
        const { artists } = song
        const artistsNames = artists.map((artist) => artist.name).join(", ")

        return (
          <TouchableOpacity style={styles.item} key={song.id}>
            <Image
              source={{ uri: song.imagePath }}
              style={styles.image}
            />
            <View>
              <Text style={styles.text}>{song.name}</Text>
              <Text style={{ color: '#ccc' }}>{artistsNames}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </>
  )
}
export default SongsSearchList

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    // borderRadius: 25,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
})