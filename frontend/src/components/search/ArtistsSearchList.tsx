import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const ArtistsSearchList = ({ artistsSearchResult }) => {

  if (!artistsSearchResult || artistsSearchResult.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>No Artists Found</Text>
      </View>
    )
  };


  return (
    <>
      {artistsSearchResult.map((artist) => (
        <TouchableOpacity
          style={styles.item}
          key={artist.id}
        // onPress={() => handleGetSongsOfArtist(artist.id)}
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