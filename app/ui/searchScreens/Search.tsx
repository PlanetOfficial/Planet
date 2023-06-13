import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {s} from 'react-native-size-matters';
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Separator from '../components/Separator';
import PoiRow from '../components/PoiRow';
import Icon from '../components/Icon';

import {GoogleMapsAPIKey} from '../../utils/api/APIConstants';
import {fetchUserLocation, handleBookmark} from '../../utils/Misc';
import {Category, Coordinate, Genre, Poi} from '../../utils/types';

const Search = ({
  navigation,
  mode = 'none',
}: {
  navigation: any;
  mode?: string;
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [location, setLocation] = useState<Coordinate>();

  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const initializeData = async () => {
    const data = await AsyncStorage.getItem('genres');
    if (data) {
      setGenres(JSON.parse(data));
    } else {
      Alert.alert('Error', 'Unable to load genres. Please try again.');
    }

    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
      setLocation(await fetchUserLocation());
    });

    return unsubscribe;
  }, [navigation]);

  const handleSelection = async (data: GooglePlaceData) => {
    if (data) {
      navigation.navigate('PoiDetail', {
        place_id: data.place_id,
        mode: mode,
      });
    } else {
      Alert.alert('Error', 'Unable to retrieve destination. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={searchStyles.header}>
          {mode !== 'none' && !searching ? (
            <View style={searchStyles.x}>
              <Icon
                icon={icons.close}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          ) : null}
          <GooglePlacesAutocomplete
            ref={autocompleteRef}
            placeholder={strings.search.search}
            disableScroll={true}
            isRowScrollable={false}
            enablePoweredByContainer={false}
            fetchDetails={false}
            query={{
              key: GoogleMapsAPIKey,
              language: 'en',
            }}
            textInputProps={{
              selectTextOnFocus: true,
              style: searchStyles.text,
              autoCapitalize: 'none',
              onFocus: () => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
                );
                setSearching(true);
              },
              onBlur() {
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'),
                );
                setSearching(false);
              },
              placeholderTextColor: colors.darkgrey,
              onChangeText: text => {
                setSearchText(text);
              },
            }}
            onPress={handleSelection}
            styles={{
              textInputContainer: [
                searchStyles.textInputContainer,
                styles.shadow,
                searching
                  ? {
                      width: s(250),
                    }
                  : null,
              ],
              textInput: searchStyles.textInput,
              separator: searchStyles.separator,
            }}
            renderLeftButton={() => (
              <Image style={searchStyles.icon} source={icons.search} />
            )}
            renderRow={rowData => (
              <View>
                <Text size="s" weight="r" color={colors.black}>
                  {rowData.structured_formatting.main_text}
                </Text>
                <Text size="xs" weight="l" color={colors.darkgrey}>
                  {rowData.structured_formatting.secondary_text}
                </Text>
              </View>
            )}
          />
          {searching ? (
            <TouchableOpacity
              style={searchStyles.cancel}
              onPress={() => autocompleteRef.current?.blur()}>
              <Text>{strings.main.cancel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
      {!searching ? (
        <ScrollView>
          {genres.map((genre: Genre, index: number) => (
            <View key={genre.id}>
              <View style={categoryStyles.header}>
                <Text>{genre.name}</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={categoryStyles.scrollView}>
                {genre.categories.map((category: Category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={categoryStyles.categoryContainer}
                    onPress={() => {
                      navigation.navigate('SearchCategory', {
                        category,
                        location,
                        radius: numbers.defaultRadius,
                        mode: mode,
                      });
                    }}>
                    <View style={[categoryStyles.iconContainer, styles.shadow]}>
                      <Image
                        style={categoryStyles.icon}
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
          <View style={categoryStyles.header}>
            <Text>{strings.profile.bookmarks}</Text>
          </View>
          <FlatList
            contentContainerStyle={searchStyles.flatList}
            keyboardShouldPersistTaps={'always'}
            data={bookmarks}
            renderItem={({item}: {item: Poi}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PoiDetail', {
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
              <View style={styles.center}>
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

const categoryStyles = StyleSheet.create({
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
});

const searchStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
  },
  text: {
    padding: 0,
    paddingLeft: s(30),
    fontSize: s(14),
    fontWeight: '700',
    width: '100%',
    fontFamily: 'Lato',
  },
  textInputContainer: {
    backgroundColor: colors.white,
    height: s(30),
    justifyContent: 'center',
    borderRadius: s(10),
    marginVertical: s(5),
  },
  textInput: {
    marginLeft: s(15),
    paddingLeft: s(10),
    fontSize: s(12),
    color: colors.black,
    backgroundColor: 'transparent',
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.lightgrey,
  },
  icon: {
    marginTop: s(7.5),
    marginLeft: s(8),
    marginRight: s(-23),
    width: s(15),
    height: s(15),
    tintColor: colors.darkgrey,
    zIndex: 5,
  },
  cancel: {
    position: 'absolute',
    top: s(5),
    right: 0,
    height: s(30),
    justifyContent: 'center',
  },
  x: {
    marginRight: s(15),
  },
  flatList: {
    paddingBottom: s(250),
  },
});

export default Search;
