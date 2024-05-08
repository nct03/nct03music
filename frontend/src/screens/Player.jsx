
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MusicPlayer from '../components/MusicPlayer';
import { addSongToPlaylist } from '../apis/MusicApi';


export default function Player() {
  const [currentSong, setCurrentSong] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddSongToPlaylist = async (id) => {
    try {
      setLoading(true);
      await addSongToPlaylist(id)

    } catch (error) {
      console.error(error.message)
      Alert.alert('Lỗi', error.message);
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#0A071E",
    marginTop: "6%", }}>
      <TouchableOpacity style={{ marginTop: "7%", marginLeft: "85%" }} onPress={() => handleAddSongToPlaylist()}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <MusicPlayer />
    </View>
  );
}

