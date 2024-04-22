import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Player () {
    return (
        <View style={styles.container}>
            <Text style={{fontSize : 200, color: "#fff"}}>
                Player
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0A071E",
        flex: 1,
        padding: 20,
        marginTop: "6%",

    }
})