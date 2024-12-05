import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Pressable, TextInput } from "react-native";
import { getAllPlaylistAlbum, deletePlaylistAlbum, createPlayListAlbum, getSongsInPlaylist, getFavoriteSongs } from "../apis/MusicApi";
import { FontAwesome } from '@expo/vector-icons';

export default function Playlist({ navigation }) {
    const [albumName, setAlbumName] = useState("");
    const [albums, setAlbums] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchInitialData()
    }, []);

    const fetchInitialData = async () => {
        try {
            const albums = await getAllPlaylistAlbum();
            setAlbums(albums)
        }
        catch (err) {
            console.error('Error fetching initial data:', err.message)
        }
    }

    const handleRemoveAlbum = async (id) => {
        try {
            // Gọi hàm API để xóa album
            await deletePlaylistAlbum(id)
            fetchInitialData()
        } catch (error) {
            console.error(error.message)
        }
    };

    const handleCreatePlayListAlbum = async () => {
        try {
            if (albumName.length == 0) {
                alert("Bạn hãy nhập tên album");
                return
            }
            await createPlayListAlbum(albumName)
            fetchInitialData()
            setIsModalVisible(false)
        } catch (err) {
            console.error(err.message)
        }
    }

    const handleGetFavoriteSongs = async () => {
        try {
            const songResults = await getFavoriteSongs();
            const favoriteSongs = songResults.items
            navigation.navigate('SongScreen', { favoriteSongs });
        } catch (error) {
            console.error('Error searching:', error.message);
        }
    }

    const handleGetSongsInList = async (id) => {
        try {
            const songResults = await getSongsInPlaylist(id)
            const favoriteSongs = songResults.items
            navigation.navigate('SongScreen', { favoriteSongs });
        }
        catch (error) {
            console.error(error.message)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                Danh sách album đã lưu
            </Text>
            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => setIsModalVisible(true)}>
                <Image
                    source={require('../assets/musicAlbum.jpg')}
                    style={{ width: 100, height: 100, borderRadius: 10, margin: 10, opacity: 0.4 }}
                />
                <Text style={{ ...styles.text, fontSize: 20, alignSelf: "center" }}>Tạo danh sách mới</Text>
            </TouchableOpacity>
            <View style={styles.centeredView}>
                <Modal
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                    animationType="fade"
                    transparent={true}
                >
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="Tên album mới..."
                            onChangeText={(text) => setAlbumName(text)}
                            style={{
                                marginBottom: 20,
                                padding: 10,
                                borderWidth: 1,
                                borderColor: '#fff',
                                borderRadius: 5,
                                width: 300,
                            }} />
                        <Pressable
                            onPress={handleCreatePlayListAlbum}>
                            <Text style={{
                                ...styles.button,
                                color: "#fff",
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                fontWeight: "bold"
                            }}>Xác nhận</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setIsModalVisible(false)}>
                            <Text style={{
                                ...styles.button,
                                color: "#fff",
                                paddingHorizontal: 36,
                                paddingVertical: 10,
                                fontWeight: "bold"
                            }}>Hủy</Text>
                        </Pressable>
                    </View>
                </Modal>
            </View>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    style={{ flexDirection: "row", width: "60%" }}
                    onPress={handleGetFavoriteSongs}
                >
                    <Image
                        source={require('../assets/FavoriteAlbum.png')}
                        style={{ width: 100, height: 100, borderRadius: 10, margin: 10 }}
                    />
                    <Text style={{ ...styles.text, fontSize: 20, alignSelf: "center" }}>Danh sách bài hát yêu thích</Text>
                </TouchableOpacity>
            </View >
            <View style={{ paddingBottom: 70 }}>
                {albums.map((item) => (
                    <View key={item.id} style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                            style={{ flexDirection: "row", width: "60%" }}
                            onPress={() => handleGetSongsInList(item.id)}
                        >
                            <Image
                                source={require('../assets/musicAlbum.jpg')}
                                style={{ width: 100, height: 100, borderRadius: 10, margin: 10 }}
                            />
                            <Text style={{ ...styles.text, fontSize: 20, alignSelf: "center" }}>{item.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: "30%", marginTop: "10%" }} onPress={() => { handleRemoveAlbum(item.id) }} >
                            <FontAwesome name="remove" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0A071E",
        flex: 1,
        padding: 20,
        marginTop: "6%",
    },
    modalView: {
        marginTop: "80%",
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        alignSelf: "center",
        borderRadius: 4,
        marginBottom: 10,
        backgroundColor: '#2196F3',
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#fff"
    },
    text: {
        color: "#fff"

    }
})