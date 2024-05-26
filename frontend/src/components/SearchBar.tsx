import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { EvilIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { setKeyword } from '../features/slices/searchSlice'
import { RootState } from '../features/store'

const SearchBar = ({ initKeyword }) => {
  const [searchTerm, setSearchTerm] = useState(initKeyword)

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()

  const handleSearch = async () => {
    if (!searchTerm) return

    dispatch(setKeyword(searchTerm))
    if (route.name !== 'SearchResultScreen') {
      setSearchTerm('')
      navigation.navigate('SearchResultScreen' as never)
    }
  }

  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity onPress={handleSearch}>
        <EvilIcons name="search" size={28} color="#fff" padding={10} />
      </TouchableOpacity>
      <TextInput
        autoCapitalize="none"
        placeholder="Search songs or artists"
        placeholderTextColor="#fff"
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
      />
    </View>
  )
}
export default SearchBar

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    width: '100%',
    alignSelf: 'center',
  },
  searchInput: {
    padding: 10,
    paddingLeft: -5,
    color: '#fff',
    width: '100%',
  },
})
