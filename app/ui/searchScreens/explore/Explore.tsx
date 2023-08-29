import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';

import {fetchUserLocation, handleBookmark} from '../../../utils/Misc';
import {Coordinate, Poi, ExploreModes} from '../../../utils/types';

import {useBookmarkContext} from '../../../context/BookmarkContext';
import SearchBar from '../../friendsScreens/components/SearchBar';
import Genres from './Genres';

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
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const mode = route.params?.mode || 'none';

  const [location, setLocation] = useState<Coordinate>();
  const [searching, setSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const {bookmarks, setBookmarks} = useBookmarkContext();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLocation(await fetchUserLocation());
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
          setSearchResults={() => {}}
          search={() => {}}
        />
      </SafeAreaView>
      {/* <Header
        navigation={navigation}
        searching={searching}
        setSearching={setSearching}
        searchText={searchText}
        setSearchText={setSearchText}
        mode={mode}
      /> */}
      {!searching ? (
        <ScrollView scrollIndicatorInsets={{right: 1}}>
          <Genres navigation={navigation} location={location} mode={mode} />
        </ScrollView>
      ) : searchText.length === 0 ? (
        <FlatList
          contentContainerStyle={styles.flatList}
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
                  location={location}
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
      ) : null}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    header: {
      marginTop: s(10),
      paddingHorizontal: s(20),
      paddingTop: s(5),
      paddingBottom: s(10),
    },
    scrollView: {
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      marginBottom: s(5),
    },
    categoryContainer: {
      alignItems: 'center',
      width: s(75),
      height: s(75),
      overflow: 'visible',
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(50),
      height: s(50),
      borderRadius: s(25),
      marginBottom: s(5),
      backgroundColor: colors[theme].primary,
    },
    icon: {
      width: '55%',
      height: '55%',
      tintColor: colors[theme].neutral,
    },
    flatList: {
      paddingBottom: s(250),
    },
  });

export default Explore;
