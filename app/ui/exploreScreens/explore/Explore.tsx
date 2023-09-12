import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import PoiRow from '../../components/PoiRow';
import Text from '../../components/Text';
import SearchBar from '../../components/SearchBar';
import Separator from '../../components/SeparatorR';

import {
  isLocationOffset,
  fetchUserLocation,
  useLoadingState,
} from '../../../utils/Misc';
import {
  Coordinate,
  Poi,
  ExploreModes,
  GoogleAutocompleteResult,
  Category,
} from '../../../utils/types';
import {
  autocompleteSearch,
  getSuggestedPoiSections,
} from '../../../utils/api/poiAPI';

import {useBookmarkContext} from '../../../context/BookmarkContext';
import {useLocationContext} from '../../../context/LocationContext';

import PoiSection from './PoiSection';
import Genres from './Genres';
import SearchResults from './SearchResults';

const Explore = ({
  navigation,
  route,
}: {
  navigation: any;
  route:
    | {
        params: {
          mode: ExploreModes;
        };
      }
    | any;
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const mode = route.params?.mode || 'none';

  const {location} = useLocationContext();
  const [myLocation, setMyLocation] = useState<Coordinate>();

  const [searchText, setSearchText] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    (Category | GoogleAutocompleteResult)[]
  >([]);

  const [loading, withLoading] = useLoadingState();

  const {bookmarks} = useBookmarkContext();

  const [suggestedPoiSections, setSuggestedPoiSections] = useState<{
    [key: string]: Poi[];
  }>({});
  const loadSuggestedPoiSections = useCallback(async () => {
    const _suggestedPoiSections = await getSuggestedPoiSections(
      location.latitude,
      location.longitude,
    );
    if (_suggestedPoiSections) {
      setSuggestedPoiSections(_suggestedPoiSections);
    } else {
      Alert.alert(strings.error.error, strings.error.loadSuggestedPoiSections);
    }
  }, [location]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setMyLocation(await fetchUserLocation());
      loadSuggestedPoiSections();
      setSearchText('');
    });

    return unsubscribe;
  }, [navigation, loadSuggestedPoiSections]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={styles.header}>
          {mode !== 'none' && !searching ? (
            <View style={styles.x}>
              <Icon
                icon={icons.drop}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          ) : null}
          <View style={styles.searchBar}>
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
                      Alert.alert(
                        strings.error.error,
                        strings.error.searchPlace,
                      );
                    }
                  } else {
                    setSearchResults([]);
                  }
                })
              }
              searchPrompt={strings.explore.search}
            />
          </View>
          {!searching ? (
            <View style={styles.icon}>
              <Icon
                size="m"
                icon={icons.locationFilled}
                color={
                  myLocation
                    ? isLocationOffset(myLocation, location)
                      ? colors[theme].accent
                      : colors[theme].blue
                    : colors[theme].secondary
                }
                onPress={() => {
                  navigation.navigate('SearchMap', {
                    myLocation,
                  });
                }}
              />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
      {!searching ? (
        <ScrollView scrollIndicatorInsets={{right: 1}}>
          <Genres navigation={navigation} myLocation={myLocation} mode={mode} />
          <Separator />
          {Object.keys(suggestedPoiSections).map((key, index) =>
            suggestedPoiSections[key].length > 0 ? (
              <PoiSection
                key={index}
                navigation={navigation}
                title={key}
                pois={suggestedPoiSections[key]}
                mode={mode}
              />
            ) : null,
          )}
        </ScrollView>
      ) : searchText.length > 2 ? (
        <SearchResults
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
                  myLocation={myLocation}
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: s(20),
  },
  x: {
    marginLeft: s(25),
  },
  searchBar: {
    flex: 1,
  },
});

export default Explore;
