import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Separator from '../../components/Separator';
import SeparatorR from '../../components/SeparatorR';
import PoiRow from '../../components/PoiRow';

import BookmarkContext from '../../../context/BookmarkContext';

import {fetchUserLocation, handleBookmark} from '../../../utils/Misc';
import {Category, Coordinate, Genre, Poi} from '../../../utils/types';

import Header from './Header';
import categories from '../../../constants/categories';

const Search = ({
  navigation,
  route,
}: {
  navigation: any;
  route:
    | {
        params: {
          mode: 'create' | 'suggest' | 'add' | 'none';
        };
      }
    | any;
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const mode = route.params?.mode || 'none';

  const [genres, setGenres] = useState<Genre[]>([]);
  const [location, setLocation] = useState<Coordinate>();
  const [searching, setSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  const initializeData = async () => {
    const data = await AsyncStorage.getItem('genres');
    if (data) {
      setGenres(JSON.parse(data));
    } else {
      Alert.alert(strings.error.error, strings.error.loadGenres);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLocation(await fetchUserLocation());
      setSearchText('');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <View style={STYLES.container}>
      <Header
        navigation={navigation}
        searching={searching}
        setSearching={setSearching}
        searchText={searchText}
        setSearchText={setSearchText}
        mode={mode}
      />
      {!searching ? (
        <ScrollView>
          {genres.map((genre: Genre, index: number) => (
            <View key={genre.id}>
              <View style={styles.header}>
                <Text size="s">{genre.name}</Text>
              </View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
                data={genre.categories}
                initialNumToRender={5}
                renderItem={({item}: {item: Category}) => (
                  <TouchableOpacity
                    style={styles.categoryContainer}
                    onPress={() => {
                      navigation.navigate('SearchCategory', {
                        category: item,
                        location,
                        radius: numbers.defaultRadius,
                        mode: mode,
                      });
                    }}>
                    <View style={[styles.iconContainer, STYLES.shadow]}>
                      <Image
                        style={styles.icon}
                        source={
                          categories[item.id - 1] || {
                            uri: item.icon.url,
                          }
                        }
                      />
                    </View>
                    <Text size="xs" weight="l" center={true}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item: Category) => item.id.toString()}
              />
              {index !== genres.length - 1 ? <SeparatorR /> : null}
            </View>
          ))}
        </ScrollView>
      ) : searchText.length === 0 ? (
        <FlatList
          contentContainerStyle={styles.flatList}
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
                  poi={item}
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
              <Text>{strings.profile.noBookmarksFound}</Text>
              <Text> </Text>
              <Text size="s">
                {strings.profile.noBookmarksFoundDescription}
              </Text>
            </View>
          }
          keyExtractor={(item: Poi) => item.id.toString()}
          ItemSeparatorComponent={Separator}
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
      paddingHorizontal: s(20),
      paddingVertical: s(5),
      marginBottom: s(5),
    },
    categoryContainer: {
      alignItems: 'center',
      width: s(75),
      minHeight: s(70),
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

export default Search;
