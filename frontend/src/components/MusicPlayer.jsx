import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { Audio } from 'expo-av';

export default function MusicPlayer({ song }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: song.url });
    setSound(sound);
    await sound.playAsync();
    setIsPlaying(true);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
      <Image source={{ uri: song.imagePath }} style={{ width: 200, height: 200 }} />
      <Text>{song.name}</Text>
      <Text>{song.artists[0].name}</Text>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Button title={isPlaying ? 'Stop' : 'Play'} onPress={isPlaying ? stopSound : playSound} />
      </View>
    </View>
  );
}

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Image, FlatList } from 'react-native';
// import { Audio } from 'expo-av';

// export default function MusicPlayer({ songs }) {
//   const [sound, setSound] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentSong, setCurrentSong] = useState(null);

//   useEffect(() => {
//     return sound
//       ? () => {
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   const playSound = async (song) => {
//     if (sound) {
//       await sound.stopAsync();
//       setSound(null);
//     }

//     const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.url });
//     setSound(newSound);
//     setCurrentSong(song);
//     await newSound.playAsync();
//     setIsPlaying(true);
//   };

//   const stopSound = async () => {
//     if (sound) {
//       await sound.stopAsync();
//       setIsPlaying(false);
//     }
//   };

//   const renderSongItem = ({ item }) => (
//     <Button title={item.name} onPress={() => playSound(item)} />
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={songs}
//         renderItem={renderSongItem}
//         keyExtractor={(item) => item.id.toString()}
//         ListHeaderComponent={() => (
//           <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
//             {currentSong && (
//               <>
//                 <Image source={{ uri: currentSong.imagePath }} style={{ width: 200, height: 200 }} />
//                 <Text>{currentSong.name}</Text>
//                 <Text>{currentSong.artists[0].name}</Text>
//               </>
//             )}
//             <View style={{ flexDirection: 'row', marginTop: 20 }}>
//               <Button title={isPlaying ? 'Stop' : 'Play'} onPress={isPlaying ? stopSound : () => playSound(songs[0])} />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }