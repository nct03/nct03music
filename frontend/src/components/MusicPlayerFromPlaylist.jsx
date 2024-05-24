import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';

export default function MusicPlayerFromPlaylist({ route }) {
    const { playlist = [] } = route.params;
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songs, setSongs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    useEffect(() => {
        loadSongsFromAPI();
    }, []);

    useEffect(() => {
        if (sound) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }
    }, [sound]);

    const loadSongsFromAPI = async () => {
        try {
            setSongs(playlist);
            await loadSong(playlist[currentSongIndex].url);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const loadSong = async (uri) => {
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
        if (isShuffle) {
            const nextIndex = Math.floor(Math.random() * songs.length);
            setCurrentSongIndex(nextIndex);
            loadSong(songs[nextIndex].url);
        } else {
            const nextIndex = (currentSongIndex + 1) % songs.length;
            setCurrentSongIndex(nextIndex);
            await sound.unloadAsync();
            await loadSong(songs[nextIndex].url);
        }
    };

    const previousSong = async () => {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        setCurrentSongIndex(prevIndex);
        await sound.unloadAsync();
        await loadSong(songs[prevIndex].url);
    };

    const toggleLooping = () => {
        setIsLooping(!isLooping);
        if(isShuffle) {
            setIsShuffle(false)
        }
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
        if(isLooping = true) {
            setIsLooping(false)
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#0A071E" }}>
            <Image
                source={{ uri: songs[currentSongIndex]?.imagePath }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
                resizeMode="cover"
            />
            <Text style={{ color: "#fff", fontSize: 28, marginTop: 30 }}>{songs[currentSongIndex]?.name}</Text>
            <Text style={{ opacity: 0.6, color: "#fff", fontSize: 16, marginTop: 10 }}>{songs[currentSongIndex]?.artists[0].name}</Text>
            <Slider
                style={{ width: 380, marginTop: 20 }}
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
            <View style={{ width: 380, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#fff" }}>{formatTime(progress * duration)}</Text>
                <Text style={{ color: "#fff" }}> {formatTime(duration)}</Text>
            </View>
            <View style={{ flexDirection: "row", width: 380, alignContent: "space-around", justifyContent: "space-around", marginTop: 30 }}>
                <FontAwesome6 name="shuffle" size={28} color={isShuffle ? "#fff" : "rgba(255,255,255,0.5)"} onPress={toggleShuffle} />
                <AntDesign name="stepbackward" size={28} color="#fff" onPress={previousSong} />
                <AntDesign name={isPlaying ? 'pausecircle' : 'caretright'} size={28} color="#fff" onPress={playPause} />
                <AntDesign name="stepforward" size={28} color="#fff" title="Next" onPress={nextSong} />
                <AntDesign name="retweet" size={28} color={isLooping ? "#fff" : "rgba(255,255,255,0.5)"} onPress={toggleLooping} />
            </View>
        </View>
    );
}