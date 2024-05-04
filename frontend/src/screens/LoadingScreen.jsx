import React from 'react';
import {ActivityIndicator, StyleSheet, View, } from 'react-native';


export const LoadingScreen = () => {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A071E',
    },
})