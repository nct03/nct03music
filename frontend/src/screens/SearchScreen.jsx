import { useState, useEffect} from "react";

export default function SearchScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);

    const checkToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                setToken(token);
            } else {
                // Redirect to login or display message
                Alert.alert('Token not found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        checkToken()

    }, []);

    const searchMusic = async () => {
        try {
          setLoading(true); // Bắt đầu hiển thị loading indicator
          let response;
          if (searchTerm.includes('by:')) {
            // Tìm theo tên ca sĩ
            const artist = searchTerm.split('by:')[1].trim();
            response = await fetch(`http://${IP}:8080/v1/songs/search?artist=${artist}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } else {
            // Tìm theo từ khóa hoặc tên ca sĩ
            response = await fetch(`http://${IP}:8080/v1/songs/search?keyword=${searchTerm}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
          const data = await response.json();
          if (data.length === 0) {
            setNoResults(true);
          } else {
            setNoResults(false);
            setSearchResults(data);
          }
        } catch (error) {
          console.error('Lỗi khi tìm kiếm:', error);
        } finally {
          setLoading(false); // Kết thúc hiển thị loading indicator
        }
      };
    

    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
    return (
        <View style={styles.search}>
          < TextInput
            placeholder="Tìm kiếm bài hát hoặc ca sĩ"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          < Button title="Tìm kiếm" onPress={searchMusic} />

          {
            loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : noResults ? (
              <Text>Không có kết quả phù hợp với từ khóa tìm kiếm</Text>
            ) : (
              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                  <View style={styles.wrapper} >
                    <Image
                      source={{ uri: item.imagePath }}
                      style={{ width: 60, height: 60 }}
                    />
                    <View style={styles.childWrapper}>
                      <Text>Ca sĩ: {item.artists[0].name}</Text>
                      <Text>Bài hát: {item.name}</Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            )}

        </View> 
    )
}