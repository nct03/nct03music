import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { usePlaybackState } from 'react-native-track-player';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function FloatingPlayer({ songData }) {
    const navigation = useNavigation();
    const playbackState = usePlaybackState();

    const handlePress = () => {
        navigation.navigate('MusicPlayerFromSong');
    };

    const handlePlayPause = () => {
        // Xử lý logic play/pause ở đây
    };

    const handleNext = () => {
        // Xử lý logic chuyển bài tiếp theo ở đây
    };

    const renderPlaybackButton = () => {
        if (playbackState === 'playing') {
            return <AntDesign name="pausecircle" size={24} color="#fff" />;
        } else {
            return <AntDesign name="caretright" size={24} color="#fff" />;
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.container}>
            <Image
                source={{ uri: songData.imagePath }}
                style={styles.trackArtworkImage}
            />
            <View style={styles.trackTitleContainer}>
                <Text style={styles.trackTitle}>{songData.name}</Text>
            </View>
            <View style={styles.trackControlsContainer}>
                <TouchableOpacity onPress={handlePlayPause}>
                    {renderPlaybackButton()}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext}>
                    <AntDesign name="stepforward" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
