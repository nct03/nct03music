
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MusicPlayer from '../components/MusicPlayer';
 


export default function Player() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#0A071E",
    marginTop: "6%", }}>
      <MusicPlayer />
    </View>
  );
}

