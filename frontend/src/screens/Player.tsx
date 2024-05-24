
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MusicPlayer from '../components/MusicPlayer';



export default function Player() {
    return (
        <View style={styles.container}>
            <MusicPlayer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#0A071E",
        marginTop: "6%",
        paddingHorizontal: 20,
    }
})