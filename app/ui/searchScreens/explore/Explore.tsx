import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';

import {
  fetchUserLocation,
  handleBookmark,
  useLoadingState,
} from '../../../utils/Misc';
import {
  Coordinate,
  Poi,
  CreateModes,
  Locality,
  Category,
} from '../../../utils/types';
import {autocompleteSearch} from '../../../utils/api/poiAPI';

import {useBookmarkContext} from '../../../context/BookmarkContext';
import SearchBar from '../../friendsScreens/components/SearchBar';
import Categories from './Categories';
import SearchResult from './SearchResult';

const Explore = ({
  navigation,
  route,
}: {
  navigation: any;
  route:
    | {
        params: {
          mode: CreateModes;
        };
      }
    | any;
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const mode = route.params?.mode || 'none';

  const [myLocation, setMyLocation] = useState<Coordinate>();

  const [searchText, setSearchText] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<(Category | Locality)[]>(
    [],
  );

  const [loading, withLoading] = useLoadingState();

  const {bookmarks, setBookmarks} = useBookmarkContext();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setMyLocation(await fetchUserLocation());
      setSearchText('');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <SearchBar
          searching={searching}
          setSearching={setSearching}
          searchText={searchText}
          setSearchText={setSearchText}
          setSearchResults={setSearchResults}
          search={text =>
            withLoading(async () => {
              setSearchText(text);
              if (text.length > 2 && myLocation) {
                const results = await autocompleteSearch(
                  text,
                  myLocation.latitude,
                  myLocation?.longitude,
                );

                if (results) {
                  setSearchResults(results);
                } else {
                  Alert.alert(strings.error.error, strings.error.searchPlace);
                }
              } else {
                setSearchResults([]);
              }
            })
          }
          searchPrompt={strings.explore.search}
        />
      </SafeAreaView>
      {!searching ? (
        <ScrollView scrollIndicatorInsets={{right: 1}}>
          <Categories
            navigation={navigation}
            myLocation={myLocation}
            mode={mode}
          />
        </ScrollView>
      ) : searchText.length > 2 ? (
        <SearchResult
          navigation={navigation}
          loading={loading}
          searchResults={searchResults}
          myLocation={myLocation}
          mode={mode}
        />
      ) : (
        <FlatList
          contentContainerStyle={STYLES.flatList}
          scrollIndicatorInsets={{right: 1}}
          keyboardShouldPersistTaps={'always'}
          data={bookmarks}
          renderItem={({item}: {item: Poi}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Poi', {
                    poi: item,
                    bookmarked: true,
                    mode: mode,
                  })
                }>
                <PoiRow
                  place={item}
                  bookmarked={true}
                  location={myLocation}
                  handleBookmark={(poi: Poi) =>
                    handleBookmark(poi, bookmarks, setBookmarks)
                  }
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={STYLES.center}>
              <Text weight="l">{strings.profile.noBookmarksFound}</Text>
              <Text> </Text>
              <Text size="s" weight="l">
                {strings.profile.noBookmarksFoundDescription}
              </Text>
            </View>
          }
          keyExtractor={(item: Poi) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default Explore;
