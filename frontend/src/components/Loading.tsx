import { View, ActivityIndicator, StyleSheet } from 'react-native'

interface LoadingProps {
  type?: 'black' | 'white'
  loadingSize?: number | 'small' | 'large'
  bgColor?: string
  color?: string
}

function Loading({
  type,
  loadingSize = 'small',
  bgColor,
  color,
}: LoadingProps) {
  let defaultBgColor = null
  let defaultColor = 'white'
  if (type === 'white') {
    defaultBgColor = { backgroundColor: 'white' }
    defaultColor = 'black'
  } else if (type === 'black') {
    defaultBgColor = { backgroundColor: 'black' }
    defaultColor = 'white'
  }

  return (
    <View
      style={[
        styles.container,
        bgColor ? { backgroundColor: bgColor } : defaultBgColor,
      ]}
    >
      <ActivityIndicator size={loadingSize} color={color || defaultColor} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
