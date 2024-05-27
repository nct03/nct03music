import { fetchMusicList } from '../apis/About';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { AntDesign, FontAwesome6, Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MusicPlayer() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadSongsFromAPI();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }, [sound, isLooping, isShuffle]);

  const loadSongsFromAPI = async () => {
    try {
      const data = await fetchMusicList();
      setSongs(data);
      await loadSong(data[0].url);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const loadSong = async (uri) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound, status } = await Audio.Sound.createAsync({ uri }, { shouldPlay: isPlaying });
    setSound(newSound);
    setIsPlaying(status.isPlaying);
    setDuration(status.durationMillis);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && status.isPlaying) {
      setProgress(status.positionMillis / status.durationMillis);
    }
    if (status.didJustFinish) {
      if (isLooping) {
        sound.replayAsync();
      } else if (isShuffle) {
        const nextIndex = Math.floor(Math.random() * songs.length);
        setCurrentSongIndex(nextIndex);
        loadSong(songs[nextIndex].url);
      } else {
        nextSong();
      }
    }
  };

  const playPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const nextSong = async () => {
    const nextIndex = isShuffle ? Math.floor(Math.random() * songs.length) : (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    await loadSong(songs[nextIndex].url);
  };

  const previousSong = async () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    await loadSong(songs[prevIndex].url);
  };

  const toggleLooping = () => {
    setIsLooping(!isLooping);
    if (isShuffle) {
      setIsShuffle(false);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (isLooping) {
      setIsLooping(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('About')}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Image
        source={{ uri: songs[currentSongIndex]?.imagePath }}
        style={styles.songImage}
        resizeMode="cover"
      />
      <Text style={styles.songTitle}>{songs[currentSongIndex]?.name}</Text>
      <Text style={styles.artistName}>{songs[currentSongIndex]?.artists[0].name}</Text>
      <Slider
        style={styles.slider}
        minimumTrackTintColor={'#6156E2'}
        maximumTrackTintColor={'#fff'}
        thumbTintColor='#6156E2'
        minimumValue={0}
        maximumValue={1}
        value={progress}
        onSlidingComplete={(value) => {
          if (sound) {
            const newPosition = value * duration;
            sound.setPositionAsync(newPosition);
          }
        }}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(progress * duration)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={toggleShuffle} >
          <FontAwesome6 name="shuffle" size={28} color={isShuffle ? "#fff" : "rgba(255,255,255,0.5)"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={previousSong}>
          <AntDesign name="stepbackward" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPause}>
          <AntDesign name={isPlaying ? 'pausecircle' : 'caretright'} size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextSong}>
          <AntDesign name="stepforward" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleLooping}>
          <AntDesign name="retweet" size={28} color={isLooping ? "#fff" : "rgba(255,255,255,0.5)"} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.iconHeart}>
        <AntDesign name="heart" size={24} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconPlus}>
        <Feather name="plus" size={28} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  songImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  songTitle: {
    color: "#fff",
    fontSize: 28,
    marginTop: 30,
  },
  artistName: {
    opacity: 0.6,
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  slider: {
    width: 380,
    marginTop: 20,
  },
  timeContainer: {
    width: 380,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "#fff",
  },
  controlsContainer: {
    flexDirection: "row",
    width: 380,
    justifyContent: "space-around",
    marginTop: 30,
  },
  iconHeart: {
    position: 'absolute',
    bottom: 140,
    left: 26,
  },
  iconPlus: {
    position: 'absolute',
    bottom: 140,
    right: 26,
  }
});