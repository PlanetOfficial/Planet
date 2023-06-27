import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Separator from '../../components/SeparatorR';
import PoiRow from '../../components/PoiRow';

import {fetchUserLocation, handleBookmark} from '../../../utils/Misc';
import {Category, Coordinate, Genre, Poi} from '../../../utils/types';

import Header from './Header';

const Search = ({
  navigation,
  mode = 'none',
}: {
  navigation: any;
  mode?: 'create' | 'suggest' | 'add' | 'none';
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [location, setLocation] = useState<Coordinate>();
  const [searching, setSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const initializeData = async () => {
    const data = await AsyncStorage.getItem('genres');
    if (data) {
      setGenres(JSON.parse(data));
    } else {
      Alert.alert(strings.error.error, strings.error.loadGenres);
    }

    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
      setLocation(await fetchUserLocation());
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={STYLES.container}>
      <Header
        navigation={navigation}
        searching={searching}
        setSearching={setSearching}
        setSearchText={setSearchText}
        mode={mode}
      />
      {!searching ? (
        <ScrollView>
          {genres.map((genre: Genre, index: number) => (
            <View key={genre.id}>
              <View style={styles.header}>
                <Text>{genre.name}</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}>
                {genre.categories.map((category: Category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryContainer}
                    onPress={() => {
                      navigation.navigate('SearchCategory', {
                        category,
                        location,
                        radius: numbers.defaultRadius,
                        mode: mode,
                      });
                    }}>
                    <View style={[styles.iconContainer, STYLES.shadow]}>
                      <Image
                        style={styles.icon}
                        source={{uri: category.icon.url}}
                      />
                    </View>
                    <Text size="xs" weight="l" center={true}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {index !== genres.length - 1 ? <Separator /> : null}
            </View>
          ))}
        </ScrollView>
      ) : searchText.length === 0 ? (
        <>
          <View style={styles.header}>
            <Text>{strings.profile.bookmarks}</Text>
          </View>
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
                <Text size="s" color={colors.darkgrey}>
                  {strings.profile.noBookmarksFoundDescription}
                </Text>
              </View>
            }
            ItemSeparatorComponent={Separator}
            keyExtractor={(item: Poi) => item.id.toString()}
          />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: s(10),
    paddingHorizontal: s(20),
    paddingTop: s(5),
    paddingBottom: s(10),
  },
  scrollView: {
    paddingHorizontal: s(20),
    paddingVertical: s(5),
    marginBottom: s(10),
  },
  categoryContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(75),
    height: s(70),
    overflow: 'visible',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: colors.white,
  },
  icon: {
    width: '60%',
    height: '60%',
  },
  flatList: {
    paddingBottom: s(250),
  },
});

export default Search;
