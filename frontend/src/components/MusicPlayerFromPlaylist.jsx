import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { addFavoriteSong, checkFavoriteStatus, removeFavoriteSong } from '../apis/MusicApi';

export default function MusicPlayerFromPlaylist({ route, navigation }) {
    const { playlist = [] } = route.params;
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songs, setSongs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false); // Biến state để theo dõi trạng thái yêu thích của bài hát hiện tại

    useEffect(() => {
        setSongs(playlist);
        loadSong(playlist[currentSongIndex].url);
        // Kiểm tra trạng thái yêu thích khi danh sách bài hát thay đổi hoặc khi bài hát hiện tại thay đổi
        checkFavoriteStatusForCurrentSong();
    }, [playlist, currentSongIndex]);

    useEffect(() => {
        if (sound) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }
    }, [sound]);

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
        await sound.unloadAsync();
        loadSong(songs[nextIndex].url);
    };

    const previousSong = async () => {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        setCurrentSongIndex(prevIndex);
        await sound.unloadAsync();
        loadSong(songs[prevIndex].url);
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

    const checkFavoriteStatusForCurrentSong = async () => {
        try {
            const favorite = await checkFavoriteStatus(songs[currentSongIndex]?.id);
            setIsFavorite(favorite);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const handleAddFavoriteSong = async () => {
        try {
            // Nếu bài hát đã được thêm vào yêu thích, hãy xóa nó khỏi danh sách yêu thích
            if (isFavorite) {
                await removeFavoriteSong(songs[currentSongIndex]?.id);
                setIsFavorite(false);
            } else {
                // Nếu bài hát chưa được thêm vào yêu thích, hãy thêm nó vào danh sách yêu thích
                await addFavoriteSong(songs[currentSongIndex]?.id);
                setIsFavorite(true);
            }
        } catch (error) {
            alert(error)
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#0A071E" }}>
            <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20 }} onPress={handleAddFavoriteSong} >
                <AntDesign name="heart" size={24} color={isFavorite ? "red" : "#fff"} />
            </TouchableOpacity>
            <Image
                source={{ uri: songs[currentSongIndex]?.imagePath }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
                resizeMode="cover"
            />
            <Text style={{ color: "#fff", fontSize: 28, marginTop: 30 }}>{songs[currentSongIndex]?.name}</Text>
            <Text style={{ opacity: 0.6, color: "#fff", fontSize: 16, marginTop: 10 }}>{songs[currentSongIndex]?.artists[0]?.name}</Text>
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
                <Text style={{ color: "#fff" }}>{formatTime(duration)}</Text>
            </View>
            <View style={{ flexDirection: "row", width: 380, alignContent: "space-around", justifyContent: "space-around", marginTop: 30 }}>
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
                    <AntDesign name="stepforward" size={28} color="#fff" title="Next" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleLooping}>
                    <AntDesign name="retweet" size={28} color={isLooping ? "#fff" : "rgba(255,255,255,0.5)"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
