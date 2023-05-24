import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import {floats} from '../../constants/numbers';

import PlaceCard from '../components/PlaceCard';
import Text from '../components/Text';
import Icon from '../components/Icon';

import {getDestinations} from '../../utils/api/destinationAPI';
import {getPlaces} from '../../utils/api/placeAPI';
import {Place, Subcategory} from '../../utils/interfaces/types';
import {getPlaceCardString} from '../../utils/functions/Misc';

interface Props {
  navigation: any;
  route: any;
}

const LiveCategory: React.FC<Props> = ({navigation, route}) => {
  const [longitude] = useState<number>(route?.params?.longitude);
  const [latitude] = useState<number>(route?.params?.latitude);
  const [categoryId] = useState<number>(route?.params?.categoryId);
  const [categoryName] = useState<string>(route?.params?.categoryName);
  const [bookmarks, setBookmarks] = useState<number[]>(
    route?.params?.bookmarks,
  );
  const [subcategories, setSubcategories] = useState<Subcategory[]>();
  const [hiddenSubCategories, setHiddenSubCategories] = useState<Subcategory[]>(
    [],
  );
  const [liveEvents, setLiveEvents] = useState<Map<number, Place[]>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<any>(null); // due to forwardRef

  useEffect(() => {
    const initializeData = async () => {
      if (route?.params?.subcategories) {
        setSubcategories(route?.params?.subcategories);

        const subcategoryIds: number[] = route?.params?.subcategories?.map(
          (subcategory: Subcategory) => subcategory.id,
        );

        setLoading(true);

        let _liveEvents: Map<number, Place[]> = new Map();
        const promises = subcategoryIds?.map(async (subcategoryId: number) => {
          const events: Place[] | null = await getDestinations(
            categoryId,
            floats.defaultRadius,
            latitude,
            longitude,
            null,
            subcategoryId,
          );
          if (events) {
            _liveEvents.set(subcategoryId, events);
          } else {
            Alert.alert('Error', 'Unable to load events. Please try again.');
          }
        });
        await Promise.all(promises);

        setLiveEvents(_liveEvents);
        setLoading(false);
      }

      if (route?.params?.hiddenSubCategories) {
        setHiddenSubCategories(route?.params?.hiddenSubCategories);
      }
    };

    initializeData();
  }, [
    categoryId,
    latitude,
    longitude,
    route?.params?.hiddenSubCategories,
    route?.params?.subcategories,
  ]);

  useEffect(() => {
    const initializeBookmarks = async () => {
      const _places = await getPlaces();

      if (_places) {
        const bookmarksIds: number[] = _places.map(
          (bookmark: Place) => bookmark.id,
        );
        setBookmarks(bookmarksIds);
      } else {
        Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeBookmarks();
    });
    return unsubscribe;
  }, [navigation]);

  const hasElements = (places: Place[] | undefined): boolean => {
    return places !== undefined && Array.isArray(places) && places.length > 0;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon
            icon={icons.back}
            onPress={() => navigation.navigate('Trending')}
          />
          <View style={headerStyles.row}>
            <Text size="xl" weight="b">
              {categoryName}
            </Text>
            <Icon
              icon={icons.settings}
              onPress={() => {
                navigation.navigate('LiveCategorySettings', {
                  subcategories,
                  hiddenSubCategories,
                });
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
        <ScrollView onTouchStart={() => ref.current?.closeDropdown()}>
          {subcategories?.map((subcategory: Subcategory, idx: number) =>
            hasElements(liveEvents?.get(subcategory.id)) ? (
              <View key={idx} style={categoryStyles.container}>
                <View style={categoryStyles.header}>
                  <Text size="m" weight="b">
                    {subcategory.name}
                  </Text>
                </View>
                <ScrollView
                  contentContainerStyle={categoryStyles.contentContainer}
                  style={categoryStyles.scrollView}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {liveEvents
                    ?.get(subcategory.id)
                    ?.map((event: Place, jdx: number) => (
                      <TouchableOpacity
                        style={categoryStyles.card}
                        key={jdx}
                        onPress={() =>
                          navigation.navigate('Place', {
                            destination: event,
                            category: categoryName,
                            bookmarked: bookmarks.includes(event.id),
                          })
                        }>
                        <PlaceCard
                          id={event.id}
                          small={true}
                          name={event.name}
                          info={getPlaceCardString(event, false)}
                          bookmarked={bookmarks.includes(event.id)}
                          setBookmarked={(bookmarked: boolean, id: number) => {
                            if (bookmarked) {
                              setBookmarks([...bookmarks, id]);
                            } else {
                              setBookmarks(
                                bookmarks.filter(
                                  (bookmark: number) => bookmark !== id,
                                ),
                              );
                            }
                          }}
                          image={{uri: event.photo}}
                        />
                      </TouchableOpacity>
                    ))}
                </ScrollView>
                <Spacer />
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
    marginTop: s(10),
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
    marginTop: s(15),
    marginHorizontal: s(20),
  },
  button: {
    width: s(30),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: s(10),
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
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

export default LiveCategory;
