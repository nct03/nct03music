import { View, ActivityIndicator, StyleSheet } from 'react-native';

function Loading({style}) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    // backgroundColor: 'black',
  },
});