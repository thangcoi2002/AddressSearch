import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

import useDebounce from './hooks/useDebounce';
import {autosuggest, geocode} from './services/mapService';

function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = 'cSwtw30B-XCt3FbIAFc2naIesb9WlybLw5Z3aD8ddZM';

  const debouncedValue = useDebounce(search, 1000);

  const handleChange = text => {
    const search = text;

    if (!search.startsWith(' ')) {
      setSearch(search);
    }
  };

  const handleClear = () => {
    setSearch('');
    setSearchResult([]);
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setIsLoading(true);
      try {
        const searchPosition = await geocode({search});
        const position = searchPosition.data.items[0]?.position;
        if (position) {
          const result = await autosuggest({
            search,
            at: `${position.lat},${position.lng}`,
          });
          setSearchResult(result.data.items);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApi();
  }, [debouncedValue]);

  const openGoogleMaps = data => {
    const lat = data.position.lat; // Vĩ độ
    const lng = data.position.lng; // Kinh độ
    const label = data.title;
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}&amp;ll=`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    });

    Linking.openURL(url);
  };

  const renderItem = item => {
    return (
      <View style={styles.itemValue}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '80%'}}>
          <EvilIcons name="location" size={20} />
          <Text>{item.title}</Text>
        </View>

        <TouchableOpacity
          onPress={() => openGoogleMaps(item)}
          style={{padding: 10}}>
          <Entypo name="location" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.boxSearch}>
        {isLoading ? (
          <ActivityIndicator size={25}/>
        ) : (
          <AntDesign name="search1" size={25} />
        )}
        <TextInput
          placeholder="Enter keyword"
          onChangeText={text => handleChange(text)}
          value={search}
          style={styles.searchInput}
        />
        {search && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClear}
            style={{width: '10%'}}>
            <MaterialIcons name="clear" size={25} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        style={{flex: 1}}
        data={searchResult}
        keyExtractor={item => item._id}
        renderItem={({item}) => renderItem(item)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boxSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  searchInput: {
    width: '84%',
  },
  itemValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: '#cccccc30',
    paddingHorizontal: 10,
    paddingVertical: 16,
    marginVertical: 6,
  },
});

export default App;
