import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { searchArtists, searchSongs } from "../apis/About";
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { getSongsOfArtist } from "../apis/MusicApi";

const SearchResultScreen = ({ route, navigation }) => {
  const { songResults, artistResults } = route.params;
  const [searchTerm, setSearchTerm] = useState('');
  const [newSongResults, setNewSongResults] = useState(songResults);
  const [newArtistResults, setNewArtistResults] = useState(artistResults);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const songsResponse = await searchSongs(searchTerm);
      const artistsResponse = await searchArtists(searchTerm);

      setNewSongResults(songsResponse);
      setNewArtistResults(artistsResponse);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSongsOfArtist = async (id) => {
    try {
      const songResults = await getSongsOfArtist(id);
      navigation.navigate('MusicPlayerFromPlaylist', { playlist: songResults });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: "row", borderColor: "#fff", borderWidth: 1, borderRadius: 20, width: 350, alignSelf: "center" }}>
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
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artists</Text>
            {newArtistResults.map((artist) => (
              <TouchableOpacity style={styles.item} key={artist.id} onPress={() => handleGetSongsOfArtist(artist.id)}>
                <Image source={{ uri: artist.photo }} style={styles.image} />
                <Text style={styles.text}>{artist.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Songs</Text>
            {newSongResults.map((song) => (
              <TouchableOpacity
                style={styles.item}
                key={song.id}
                onPress={() => navigation.navigate('MusicPlayerFromSong', { playlist: [song] })}
              >
                <Image source={{ uri: song.imagePath }} style={styles.image} />
                <Text style={styles.text}>{song.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0A071E",
    flex: 1,
    padding: 20,
    marginTop: "6%",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#fff"
  },
  loadingIndicator: {
    marginTop: 20,
  }
});

export default SearchResultScreen;
