import { fetchMusicList } from '../apis/About';
import { addFavoriteSong, checkFavoriteStatus, removeFavoriteSong } from '../apis/MusicApi';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons';

export default function Player(navigation) {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songs, setSongs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);




    useEffect(() => {
        loadSongsFromAPI();
    }, [songs]);

    useEffect(() => {
        if (sound) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }
    }, [sound]);

    const loadSongsFromAPI = async () => {
        try {
            const data = await fetchMusicList();
            setSongs(data);
            await loadSong(data[currentSongIndex].url);
            await checkFavoriteStatusAndUpdate();
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

    const checkFavoriteStatusAndUpdate = async () => {
        try {
            if (songs[currentSongIndex]) { // Add this check
                const favorite = await checkFavoriteStatus(songs[currentSongIndex].id);
                setIsFavorite(favorite);
            }
        } catch (error) {
            console.error('Error checking favorite status:', error);
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
        if (isShuffle) {
            setIsShuffle(false)
        }
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
        if (isLooping) {
            setIsLooping(false)
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleAddFavoriteSong = async () => {
        const songId = songs[currentSongIndex]?.id;
        if (!songId) {
            console.error('Song ID is undefined');
            return;
        }

        try {
            if (isFavorite) {
                await removeFavoriteSong(songId);
                setIsFavorite(false);
            }
            else {
                await addFavoriteSong(songId);
                setIsFavorite(true);
            }
        } catch (error) {
            Alert.alert(error);
        }
    };





    const [musicList, setMusicList] = useState([]);

    useEffect(() => {
        loadSongsFromAPI();
    }, []);

    useEffect(() => {
        if (musicList.length > 0) {
            setSongs([...musicList]);
        }
    }, [musicList]);

    const handleSongPress = (songData) => {
        navigation.navigate('MusicPlayerFromSong', { playlist: [songData] });
    };
    return (
        <View style={styles.container}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ position: 'absolute', top: 5, left: 5 }} onPress={() => navigation.navigate('About')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5 }} onPress={handleAddFavoriteSong}>
                    <AntDesign name="heart" size={24} color={isFavorite ? "red" : "#fff"} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 160 }}>
                    <Image
                        source={{ uri: songs[currentSongIndex]?.imagePath }}
                        style={{ width: 150, height: 150, borderRadius: 10 }}
                        resizeMode="cover"
                    />
                    <Text style={{ color: "#fff", fontSize: 22, marginTop: 15 }}>{songs[currentSongIndex]?.name}</Text>
                    <Text style={{ opacity: 0.6, color: "#fff", fontSize: 16, marginTop: 5 }}>{songs[currentSongIndex]?.artists[0].name}</Text>
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
                    <View style={{ flexDirection: "row", width: 380, alignContent: "space-around", justifyContent: "space-around", marginTop: 10 }}>
                        <TouchableOpacity onPress={toggleShuffle} >
                            <FontAwesome6 name="shuffle" size={20} color={isShuffle ? "#fff" : "rgba(255,255,255,0.5)"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={previousSong}>
                            <AntDesign name="stepbackward" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={playPause}>
                            <AntDesign name={isPlaying ? 'pausecircle' : 'caretright'} size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextSong}>
                            <AntDesign name="stepforward" size={20} color="#fff" title="Next" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleLooping}>
                            <AntDesign name="retweet" size={20} color={isLooping ? "#fff" : "rgba(255,255,255,0.5)"} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{ color: "#fff", width: 380, fontSize: 24, fontWeight: "bold", marginRight: 20, marginTop: 30, marginBottom: 10 }}> Danh sách phát nhạc: </Text>
                        <FlatList
                            data={songs}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSongPress(item)}>
                                    <View style={styles.songItem}>
                                        <Image
                                            source={{ uri: item.imagePath }}
                                            style={styles.songImage}
                                        />
                                        <View style={styles.songInfo}>
                                            <Text style={styles.songName}>{item.name}</Text>
                                            <Text style={styles.artistName}>{item.artists[0].name}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>


                </View>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A071E',
        padding: 20,
        marginTop: '6%',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    songInfo: {
        marginLeft: 10,
    },
    songName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    artistName: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
})