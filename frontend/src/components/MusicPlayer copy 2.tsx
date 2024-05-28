import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'
import { AVPlaybackStatus, Audio } from 'expo-av'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import {
  nextSong,
  prevSong,
  selectPlayer,
  setCurrentIndex,
  setDuration,
  setLoopingStatus,
  setPlayingState,
  setProgress,
  setShuffleStatus,
} from '../features/slices/playerSlice'
import { useAppDispatch, useAppSelector } from '../features/store'
import { formatTime } from '../utils/formatHelper'
import {
  findNextSong,
  findPreviousSong,
  findSongIndex,
  shuffleSongs,
} from '../utils/songHelper'

export default function MusicPlayer() {
  const [currentSound, setCurrentSound] = useState<Audio.Sound>()

  const {
    songPage,
    currentSongIndex,
    loopingStatus,
    isShuffle,
    progress,
    duration,
    isPlaying,
    shuffledSongs,
  } = useAppSelector(selectPlayer)
  const dispatch = useAppDispatch()
  const loopingStatusRef = useRef(loopingStatus)
  const isShuffleRef = useRef(isShuffle)

  useEffect(() => {
    loopingStatusRef.current = loopingStatus
  }, [loopingStatus])

  useEffect(() => {
    isShuffleRef.current = isShuffle
  }, [isShuffle])

  const loadSong = async (uri: string) => {
    // if (currentSound) {
    //   await currentSound.unloadAsync()
    // }
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      {
        shouldPlay: isPlaying,
      }
    )
    setCurrentSound(sound)
  }

  useEffect(() => {
    loadSong(songPage.items[currentSongIndex].url)
  }, [songPage, currentSongIndex])

  useEffect(() => {
    if (currentSound) {
      currentSound.setIsLoopingAsync(loopingStatus === 'song')
    }
  }, [loopingStatus, currentSound])

  const hanldeEndSong = () => {
    if (loopingStatusRef.current === 'none') {
      dispatch(setPlayingState(false))
    } else if (loopingStatusRef.current === 'song') {
      console.log('2')
      dispatch(setPlayingState(true))
      currentSound?.replayAsync()
    } else if (loopingStatusRef.current === 'list') {
      console.log('3')
      handleNextSong()
    }
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (isPlaying) {
        dispatch(
          setProgress(status.positionMillis / (status.durationMillis || 1))
        )
        dispatch(setDuration(status.durationMillis || 0))

        if (status.positionMillis === status.durationMillis) {
          console.log('test')
          hanldeEndSong()
        }
      }
    }
  }
  useEffect(() => {
    if (currentSound) {
      currentSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }
  }, [currentSound])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSound && isPlaying) {
        currentSound.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            dispatch(
              setProgress(status.positionMillis / (status.durationMillis || 1))
            )
            dispatch(setDuration(status.durationMillis || 0))
          }
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSound, isPlaying])

  const playPause = async () => {
    if (!currentSound) return
    const status = await currentSound.getStatusAsync()

    if (isPlaying) {
      await currentSound.pauseAsync()
      dispatch(setPlayingState(false))
    } else {
      if (
        status.didJustFinish ||
        status.positionMillis === status.durationMillis
      ) {
        await currentSound.setPositionAsync(0) // Reset the position to the beginning
      }
      await currentSound.playAsync()
      dispatch(setPlayingState(true))
    }
  }

  const handleNextSong = async () => {
    if (currentSound) {
      await currentSound.unloadAsync()
    }
    const currentSong = songPage.items[currentSongIndex]
    if (isShuffleRef.current) {
      const nextSong = findNextSong(shuffledSongs, currentSong)
      const nextIndex = findSongIndex(songPage.items, nextSong)
      dispatch(setCurrentIndex(nextIndex))
    } else {
      dispatch(nextSong())
    }
  }

  const handlePrevSong = async () => {
    if (currentSound) {
      await currentSound.unloadAsync()
    }
    const currentSong = songPage.items[currentSongIndex]
    if (isShuffle) {
      const nextSong = findPreviousSong(shuffledSongs, currentSong)
      const nextIndex = findSongIndex(songPage.items, nextSong)
      dispatch(setCurrentIndex(nextIndex))
    } else {
      dispatch(prevSong())
    }
  }

  const toggleLooping = () => {
    dispatch(setLoopingStatus(loopingStatus))
  }

  const toggleShuffle = () => {
    dispatch(setShuffleStatus(!isShuffle))
  }

  return (
    <View style={styles.container}>
      {/* Song Info */}
      <View style={styles.songInfo}>
        <Image
          source={{ uri: songPage.items[currentSongIndex]?.imagePath }}
          style={styles.songImage}
          resizeMode="cover"
        />
        <Text style={styles.songName}>
          {songPage.items[currentSongIndex]?.name}
        </Text>
        <Text style={styles.songArtist}>
          {songPage.items[currentSongIndex]?.artists[0].name}
        </Text>
      </View>

      {/* Slider */}
      <View>
        <Slider
          style={styles.slider}
          minimumTrackTintColor={'#6156E2'}
          maximumTrackTintColor={'#fff'}
          thumbTintColor="#6156E2"
          minimumValue={0}
          maximumValue={1}
          value={progress}
          onValueChange={(value) => {
            dispatch(setProgress(value))
          }}
          onSlidingComplete={(value) => {
            if (currentSound) {
              const newPosition = value * duration
              currentSound.setPositionAsync(newPosition)
            }
          }}
        />
        <View style={styles.timeContainer}>
          <Text style={{ color: '#fff' }}>
            {formatTime(progress * duration)}
          </Text>
          <Text style={{ color: '#fff' }}> {formatTime(duration)}</Text>
        </View>
      </View>
      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <View>
          <Pressable onPress={toggleShuffle}>
            <FontAwesome6
              name="shuffle"
              size={32}
              color={isShuffle ? '#fff' : 'rgba(255,255,255,0.5)'}
            />
          </Pressable>
        </View>
        <View>
          <Pressable onPress={handlePrevSong}>
            <AntDesign name="stepbackward" size={28} color="#fff" />
          </Pressable>
        </View>
        <View>
          <Pressable>
            <AntDesign
              name={isPlaying ? 'pausecircle' : 'caretright'}
              size={28}
              color="#fff"
              onPress={playPause}
            />
          </Pressable>
        </View>
        <View>
          <Pressable>
            <AntDesign
              name="stepforward"
              size={28}
              color="#fff"
              title="Next"
              onPress={handleNextSong}
            />
          </Pressable>
        </View>

        <View>
          <Pressable
            onPress={toggleLooping}
            style={{
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loopingStatus === 'none' && (
              <AntDesign
                name="retweet"
                size={32}
                color="rgba(255,255,255,0.5)"
              />
            )}
            {loopingStatus === 'song' && (
              <AntDesign name="retweet" size={32} color="#fff" />
            )}
            {loopingStatus === 'list' && (
              <>
                <AntDesign name="retweet" size={32} color="#fff" />
                <Text style={styles.numberIcon}>1</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    alignItems: 'center',
  },
  songImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  songName: {
    color: '#fff',
    fontSize: 28,
    marginTop: 30,
  },
  songArtist: {
    opacity: 0.6,
    color: '#fff',
    marginTop: 10,
  },
  slider: {
    marginTop: 20,
    width: 350,
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'space-around',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  numberIcon: {
    flex: 1,
    color: '#fff',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    fontSize: 10,
  },
})
