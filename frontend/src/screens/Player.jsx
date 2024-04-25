// import React, { useEffect, useState, useContext } from "react";
// import { BasicIP } from "../constant/Constants";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { fetchMusicList } from "../apis/About";
// import { Audio } from "expo-av";
// import { Player_ } from "../helpers/PlayerContext";

// export default function Player() {

//     const [savedTracks, setSavedTracks] = useState([]);
//     const { currentTrack, setCurrentTrack } = useContext(Player_);
//     const [currentSound, setCurrentSound] = useState(null);
//     const [progress, setProgress] = useState(null);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [totalDuration, setTotalDuration] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);

//     const getSavedTracks = async () => {
//         const data = await fetchMusicList()
//         setSavedTracks(data);
//     }

//     useEffect(() => {
//         getSavedTracks();
//     }, []);

//     const playTrack = async () => {
//         if (savedTracks.length > 0) {
//           setCurrentTrack(savedTracks[0]);
//         }
//         await play(savedTracks[0]);
//     };

//     const play = async (nextTrack) => {
//         console.log(nextTrack);
//         const preview_url = nextTrack?.track?.preview_url;
//         try {
//           if (currentSound) {
//             await currentSound.stopAsync();
//           }
//           await Audio.setAudioModeAsync({
//             playsInSilentModeIOS: true,
//             staysActiveInBackground: false,
//             shouldDuckAndroid: false,
//           });
//           const { sound, status } = await Audio.Sound.createAsync(
//             {
//               uri: preview_url,
//             },
//             {
//               shouldPlay: true,
//               isLooping: false,
//             },
//             onPlaybackStatusUpdate
//           );
//           onPlaybackStatusUpdate(status);
//           setCurrentSound(sound);
//           setIsPlaying(status.isLoaded);
//           await sound.playAsync();
//         } catch (err) {
//           console.log(err.message);
//         }
//       };

//       const onPlaybackStatusUpdate = async (status) => {
//         console.log(status);
//         if (status.isLoaded && status.isPlaying) {
//           const progress = status.positionMillis / status.durationMillis;
//           console.log("progresss", progress);
//           setProgress(progress);
//           setCurrentTime(status.positionMillis);
//           setTotalDuration(status.durationMillis);
//         }
    
//         if (status.didJustFinish === true) {
//           setCurrentSound(null);
//           playNextTrack();
//         }
//       };
    
//       const circleSize = 12;
//       const formatTime = (time) => {
//         const minutes = Math.floor(time / 60000);
//         const seconds = Math.floor((time % 60000) / 1000);
//         return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//       };
    
//       const handlePlayPause = async () => {
//         if (currentSound) {
//           if (isPlaying) {
//             await currentSound.pauseAsync();
//           } else {
//             await currentSound.playAsync();
//           }
//           setIsPlaying(!isPlaying);
//         }
//       };

//     return (
//         <View style={styles.container}>
//             <View style={styles.row}>
//                 <TouchableOpacity
//                     style={styles.btn}
//                     onPress={()=> handlePlayPause()}
//                     >
//                     <Text style={styles.text}>Pause</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.btn} onPress={() =>play()}>
//                     <Text style={styles.text}>Play</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.row}>
//                 <TouchableOpacity
//                     style={styles.btn}
//                 >
//                     <Text style={styles.text}>Prev</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.btn}
//                 >
//                     <Text style={styles.text}>Next</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//     },
//     btn: {
//         backgroundColor: '#ff0044',
//         padding: 15,
//         borderRadius: 10,
//         margin: 10,
//         width: 160,
//     },
//     text: {
//         fontSize: 30,
//         color: 'white',
//         textAlign: 'center',
//     },
//     row: {
//         flexDirection: 'row',
//         marginBottom: 20,
//     },
// });

import React from 'react';
import { View } from 'react-native';
import MusicPlayer from '../components/MusicPlayer';

const songFromApi = {
  id: 43,
  name: 'New Divide',
  imagePath: 'http://192.168.100.177:8080/v1/songs/images/1596681051484.jpg',
  url: 'http://192.168.100.177:8080/v1/songs/files/NewDivide-LinkinPark-6450792.mp3',
  releasedOn: '2023-12-23',
  genre: 'Rock',
  numberLikes: 0,
  artists: [
    {
      id: 10,
      name: 'Linkin Park',
      photo: 'http://192.168.100.177:8080/v1/artists/images/04826.jpg'
    }
  ]
};

export default function Player() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MusicPlayer song={songFromApi} />
    </View>
  );
}

