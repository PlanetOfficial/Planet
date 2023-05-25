import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {s} from 'react-native-size-matters';
import Geolocation from '@react-native-community/geolocation';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {floats} from '../../constants/numbers';
import strings from '../../constants/strings';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PlaceCard from '../components/PlaceCard';

import {getPlaces} from '../../utils/api/placeAPI';
import {getDestinations} from '../../utils/api/destinationAPI';
import {getLiveCategories} from '../../utils/api/genresAPI';
import {Category, Place} from '../../utils/interfaces/types';

const Trending = ({navigation} : {navigation: any}) => {
  const [latitude, setLatitude] = useState<number>(floats.defaultLatitude);
  const [longitude, setLongitude] = useState<number>(floats.defaultLongitude);
  const [radius] = useState<number>(floats.defaultRadius);
  const [eventsData, setEventsData] = useState<Map<number, Place[]>>(new Map());
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [liveCategories, setLiveCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeData = async () => {
      const _places: Place[] | null = await getPlaces();

      if (_places) {
        const bookmarksIds: number[] = _places.map(
          (bookmark: Place) => bookmark.id,
        );
        setBookmarks(bookmarksIds);
      } else {
        Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
      }

      const _liveCategories: Category[] | null = await getLiveCategories();
      if (_liveCategories) {
        setLiveCategories(_liveCategories);
      } else {
        Alert.alert('Error', 'Unable to load categories. Please try again.');
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const detectLocation = async () => {
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

      const requestAPI = async (_latitude: number, _longitude: number) => {
        let _eventsData: Map<number, Place[]> = new Map();

        const promises = liveCategories?.map(async (category: Category) => {
          const events: Place[] | null = await getDestinations(
            category.id,
            radius,
            _latitude,
            _longitude,
          );
          if (events) {
            _eventsData.set(category.id, events);
          } else {
            Alert.alert('Error', 'Unable to load events. Please try again.');
          }
        });
        await Promise.all(promises);

        setLoading(false);
        setEventsData(_eventsData);
      };

      Geolocation.getCurrentPosition(async position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        requestAPI(position.coords.latitude, position.coords.longitude);
      });
    };

    if (liveCategories?.length > 0) {
      detectLocation();
    }
  }, [radius, liveCategories]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <Text size="xl" weight="b">
            {strings.title.trending}
          </Text>

          <View style={headerStyles.search}>
            <Icon
              icon={icons.search}
              onPress={() => {
                // TODO: implement trending search
                Alert.alert('Search', 'Search is not implemented yet.');
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <ScrollView>
          {liveCategories?.map((category: Category, idx: number) =>
            eventsData.get(category.id) ? (
              <View key={idx} style={categoryStyles.container}>
                <View style={categoryStyles.header}>
                  <Text size="m" weight="b">
                    {category.name}
                  </Text>
                  {category.subcategories &&
                  category.subcategories.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('LiveCategory', {
                          subcategories: category.subcategories,
                          hiddenSubCategories: [],
                          categoryId: category.id,
                          categoryName: category.name,
                          bookmarks,
                          latitude,
                          longitude,
                          radius,
                        });
                      }}>
                      <Text size="xs" weight="b" color={colors.accent}>
                        {strings.trending.seeAll}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <ScrollView
                  contentContainerStyle={categoryStyles.contentContainer}
                  style={categoryStyles.scrollView}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {eventsData
                    .get(category.id)
                    ?.map((event: Place, jdx: number) => (
                      <TouchableOpacity
                        style={categoryStyles.card}
                        key={jdx}
                        onPress={() => {
                          navigation.navigate('Place', {
                            destination: event,
                            bookmarked: bookmarks.includes(event.id),
                          });
                        }}>
                        <PlaceCard
                          place={event}
                          bookmarked={bookmarks.includes(event.id)}
                          setBookmarked={(
                            bookmarked: boolean,
                            place: Place,
                          ) => {
                            if (bookmarked) {
                              setBookmarks([...bookmarks, place.id]);
                            } else {
                              setBookmarks(
                                bookmarks.filter(
                                  (bookmark: number) => bookmark !== place.id,
                                ),
                              );
                            }
                          }}
                          image={{uri: event.photo}}
                          small={true}
                          displayCategory={false}
                        />
                      </TouchableOpacity>
                    ))}
                </ScrollView>
                {idx === liveCategories?.length - 1 ? (
                  <View style={styles.bottomPadding} />
                ) : (
                  <Spacer />
                )}
              </View>
            ) : null,
          )}
        </ScrollView>
      )}
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginLeft: s(20),
    marginTop: s(15),
  },
  bottomPadding: {
    height: s(20),
  },
  center: {
    height: s(400),
    justifyContent: 'center',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
  },
  in: {
    marginTop: s(2),
    marginHorizontal: s(6),
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    marginLeft: s(2),
  },
  search: {
    position: 'absolute',
    right: s(20),
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    marginTop: s(15),
  },
  header: {
    marginHorizontal: s(20),
    marginBottom: s(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: s(250),
    marginRight: s(10),
  },
  scrollView: {
    overflow: 'visible',
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
  },
});

export default Trending;
