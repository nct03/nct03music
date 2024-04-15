import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Playlist() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                Danh sách album đã lưu
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0A071E",
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#fff"
    }
})