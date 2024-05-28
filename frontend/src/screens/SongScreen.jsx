import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SongScreen({ route, navigation }) {
  const { favoriteSongs } = route.params;
  const [songs, SetSongs] = useState(favoriteSongs);
  const navigateToMusicPlayer = () => {
    navigation.navigate('MusicPlayerFromPlaylist', { playlist: favoriteSongs });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Songs</Text>
        <TouchableOpacity onPress={navigateToMusicPlayer}>
          <Text style={{ color: "#fff" }}>Play All Songs</Text>
        </TouchableOpacity>
        {songs.map((song) => (
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

    </ScrollView >
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
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    padding: 10,
  },
});

