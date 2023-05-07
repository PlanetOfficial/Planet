import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {s} from 'react-native-size-matters';
import Geolocation from '@react-native-community/geolocation';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {genres} from '../../constants/genres';
import {floats, integers} from '../../constants/numbers';
import strings from '../../constants/strings';

import {getBookmarks} from '../../utils/api/shared/getBookmarks';
import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';
import {Subcategory} from '../../utils/interfaces/types';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PlaceCard from '../components/PlaceCard';

import {Category, LiveEvent, LiveEvents} from '../../utils/interfaces/types';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Props {
  navigation: any;
}

const Trending: React.FC<Props> = ({navigation}) => {
  const [latitude, setLatitude] = useState<number>(floats.defaultLatitude);
  const [longitude, setLongitude] = useState<number>(floats.defaultLongitude);
  const [radius] = useState<number>(floats.defaultRadius);
  const [eventsData, setEventsData] = useState<LiveEvents>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const _bookmarks = await getBookmarks(authToken);
      const bookmarksIds: number[] = _bookmarks.map(
        (bookmark: any) => bookmark.id,
      );
      setBookmarks(bookmarksIds);
    };

    initializeData();
  }, []);

  useEffect(() => {
    const detectLocation = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      } else if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted.');
          } else {
            console.log('Location permission denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      }

      const requestAPI = async (_latitude: number, _longitude: number) => {
        const categoryIds: number[] = genres[0].categories.map(
          (category: Category) => category.id,
        );

        const liveEvents: LiveEvents = await requestLocations(
          categoryIds,
          radius,
          _latitude,
          _longitude,
          integers.defaultNumPlaces,
        );

        setEventsData(liveEvents);
      };

      Geolocation.getCurrentPosition(
        async position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          requestAPI(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.log(error);

          setLatitude(floats.defaultLatitude);
          setLongitude(floats.defaultLongitude);
          requestAPI(floats.defaultLatitude, floats.defaultLongitude);
        },
      );
    };

    detectLocation();
  }, [radius]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <Text size="xl" weight="b">
            {strings.title.trending}
          </Text>
          <View style={headerStyles.in}>
            <Text size="l" weight="b" color={colors.darkgrey}>
              {strings.trending.in}
            </Text>
          </View>
          <TouchableOpacity
            style={headerStyles.fgSelector}
            onPress={() => console.log('Switch location')}>
            <Text size="xl" weight="b" color={colors.accent}>
              Seattle
            </Text>
            <View style={headerStyles.drop}>
              <Icon size="xs" icon={icons.drop} />
            </View>
          </TouchableOpacity>

          <View style={headerStyles.search}>
            <Icon
              size="m"
              icon={icons.search}
              onPress={() => {
                navigation.navigate('SearchLibrary');
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        {genres[0].categories.map((category: Category, idx: number) =>
          eventsData[category.id] && eventsData[category.id].length > 0 ? (
            <View key={idx} style={categoryStyles.container}>
              <View style={categoryStyles.header}>
                <Text size="m" weight="b">
                  {category.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    let defaultSubcategories: Subcategory[] = [];
                    let hiddenSubCategories: Subcategory[] = [];

                    if (category.subcategories) {
                      if (category.subcategories?.length <= 5) {
                        defaultSubcategories = category.subcategories;
                      } else {
                        defaultSubcategories = category.subcategories?.slice(
                          0,
                          5,
                        );
                        hiddenSubCategories = category.subcategories?.slice(5);
                      }

                      navigation.navigate('LiveCategory', {
                        subcategories: defaultSubcategories,
                        hiddenSubCategories,
                        categoryId: category.id,
                        categoryName: category.name,
                        bookmarks,
                        latitude,
                        longitude,
                        radius,
                      });
                    }
                  }}>
                  <Text size="xs" weight="b" color={colors.accent}>
                    {strings.trending.seeAll}
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={categoryStyles.contentContainer}
                style={categoryStyles.scrollView}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {eventsData[category.id]
                  ? eventsData[category.id].map(
                      (event: LiveEvent, jdx: number) => (
                        <TouchableOpacity
                          style={categoryStyles.card}
                          key={jdx}
                          onPress={() =>
                            navigation.navigate('Place', {
                              destination: event,
                              category: event.category,
                            })
                          }>
                          <PlaceCard
                            id={event.id}
                            name={event.name}
                            info={event.date}
                            marked={bookmarks.includes(event.id)}
                            image={{uri: event.image_url}}
                          />
                        </TouchableOpacity>
                      ),
                    )
                  : null}
              </ScrollView>
              {idx === genres[0].categories.length - 1 ? (
                <View style={styles.bottomPadding} />
              ) : (
                <Spacer />
              )}
            </View>
          ) : null,
        )}
      </ScrollView>
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
  fgSelector: {
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
