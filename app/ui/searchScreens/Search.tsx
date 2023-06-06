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
  PermissionsAndroid,
  Platform,
  LayoutAnimation,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {s} from 'react-native-size-matters';
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

import colors from '../../constants/colors';
import styles from '../../constants/styles';
import {defaultParams} from '../../constants/numbers';

import Text from '../components/Text';
import Separator from '../components/Separator';

import {GoogleMapsAPIKey} from '../../utils/api/APIConstants';
import {Category, Coordinate, Genre} from '../../utils/types';
import strings from '../../constants/strings';
import icons from '../../constants/icons';

const Search = ({navigation}: {navigation: any}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [location, setLocation] = useState<Coordinate>();

  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
  const [searching, setSearching] = useState<boolean>(false);

  const fetchUserLocation = async (): Promise<Coordinate> => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Error', 'Location permission denied.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    return new Promise(res => {
      Geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        res({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    });
  };

  const initializeData = async () => {
    const data = await AsyncStorage.getItem('genres');
    if (data) {
      setGenres(JSON.parse(data));
    } else {
      Alert.alert('Error', 'Unable to load genres. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      fetchUserLocation();
    });

    return unsubscribe;
  }, [navigation]);

  const handleSelection = async (data: GooglePlaceData) => {
    if (data) {
      navigation.navigate('PoiDetail', {place_id: data.place_id});
    } else {
      Alert.alert('Error', 'Unable to retrieve destination. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={searchStyles.header}>
        <Image style={searchStyles.icon} source={icons.search} />
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder={strings.search.search}
          disableScroll={true}
          isRowScrollable={false}
          minLength={3}
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
          }}
          onPress={handleSelection}
          styles={{
            container: searchStyles.container,
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
          renderRow={rowData => (
            <View style={searchStyles.row}>
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
      </SafeAreaView>
      {!searching ? (
        <FlatList
          data={genres}
          renderItem={({item}: {item: Genre}) => (
            <View style={categoryStyles.container}>
              <View style={categoryStyles.header}>
                <Text>{item.name}</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={categoryStyles.scrollView}>
                {item.categories.map((category: Category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={categoryStyles.categoryContainer}
                    onPress={() => {
                      navigation.navigate('SearchCategory', {
                        category,
                        location,
                        radius: defaultParams.defaultRadius,
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
            </View>
          )}
          ItemSeparatorComponent={Separator}
          keyExtractor={(item: Genre) => item.id.toString()}
        />
      ) : null}
    </View>
  );
};

const categoryStyles = StyleSheet.create({
  container: {
    paddingVertical: s(10),
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: s(5),
    paddingBottom: s(10),
  },
  scrollView: {
    paddingHorizontal: s(20),
    paddingVertical: s(5),
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
  },
  container: {
    flex: 0,
    width: s(310),
    marginHorizontal: s(20),
  },
  text: {
    fontSize: s(14),
    fontWeight: '700',
    width: '100%',
    paddingLeft: s(32),
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
    paddingVertical: 0,
    marginLeft: s(15),
    paddingLeft: s(10),
    marginBottom: 0,
    height: s(25),
    fontSize: s(12),
    color: colors.black,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.lightgrey,
  },
  icon: {
    marginTop: s(12.5),
    marginLeft: s(27),
    width: s(15),
    height: s(15),
    marginRight: -s(42),
    tintColor: colors.darkgrey,
    zIndex: 5,
  },
  cancel: {
    marginTop: s(10),
    marginLeft: -s(67),
  },
  row: {},
});

export default Search;
