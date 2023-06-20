import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  ImageBackground,
  Animated,
  TouchableOpacity,
  Image,
  LayoutAnimation,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import {showLocation} from 'react-native-map-link';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from 'react-native-image-viewing';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {Poi, PoiDetail, Review} from '../../utils/types';
import {getPoi, postPoi} from '../../utils/api/poiAPI';
import {handleBookmark, isOpen} from '../../utils/Misc';

const PoiDetailPage = ({navigation, route}: {navigation: any; route: any}) => {
  StatusBar.setBarStyle('light-content', true);
  const date = new Date();

  const [destination, setDestination] = useState<Poi>();
  const [destinationDetails, setDestinationDetails] = useState<PoiDetail>();

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);
  const [open, setOpen] = useState<boolean>();

  const [mode] = useState<string>(route.params.mode);

  const [mapExpanded, setMapExpanded] = useState<boolean>(false);
  const [hoursExpanded, setHoursExpanded] = useState<boolean>(false);

  const initializeBookmarks = useCallback(async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  }, []);

  const initializeDestinationData = useCallback(async () => {
    if (route.params.place_id) {
      const result = await postPoi(route.params.place_id);
      if (result) {
        setDestination(result.poi);
        setDestinationDetails(result.poiDetail);
        setOpen(
          result.poiDetail.periods ? isOpen(result.poiDetail.periods) : false,
        );
      } else {
        Alert.alert(strings.error.error, strings.error.loadDestinationDetails);
      }
    } else if (route.params.poi) {
      const _destination = route.params.poi;
      setDestination(_destination);

      const details: PoiDetail | null = await getPoi(
        _destination.place_id,
        _destination.supplier,
      );

      if (details) {
        setDestinationDetails(details);
        setOpen(details.periods ? isOpen(details.periods) : false);
      } else {
        Alert.alert(strings.error.error, strings.error.loadDestinationDetails);
      }
    }
  }, [route.params.poi, route.params.place_id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeBookmarks();
      initializeDestinationData();
    });

    return unsubscribe;
  }, [navigation, initializeBookmarks, initializeDestinationData]);

  const handleMapPress = async () => {
    if (!destination) {
      return;
    }
    showLocation({
      latitude: destination.latitude,
      longitude: destination.longitude,
      title: destination.name,
    });
  };

  const handleCallPress = async () => {
    if (destinationDetails?.url) {
      await Linking.openURL(
        `tel:${
          destinationDetails.phone
            ? destinationDetails.phone.replace(/\D/g, '')
            : ''
        }`,
      );
    }
  };

  const handleWebsitePress = async () => {
    if (destinationDetails?.website) {
      await Linking.openURL(destinationDetails.website);
    }
  };

  const getButtonString = () => {
    if (mode === 'create' || mode === 'add') {
      return 'Add';
    } else if (mode === 'suggest') {
      return 'Suggest';
    } else {
      return 'Create';
    }
  };

  const [galleryVisible, setGalleryVisible] = useState(false);
  const HeaderComponent = useCallback(
    () => (
      <View style={localStyles.imageTitle}>
        <Text center={true} color={colors.white}>
          {strings.poi.images}
        </Text>
        <View style={localStyles.closeGallery}>
          <Icon
            icon={icons.close}
            color={colors.white}
            onPress={() => setGalleryVisible(false)}
          />
        </View>
      </View>
    ),
    [],
  );

  const insets = useSafeAreaInsets();
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollPosition.interpolate({
    inputRange: [s(35), s(170)],
    outputRange: [insets.top + s(170), insets.top + s(35)],
    extrapolate: 'clamp',
  });
  const topTitleOpacity = scrollPosition.interpolate({
    inputRange: [s(100), s(180)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const bottomTitleOpacity = scrollPosition.interpolate({
    inputRange: [s(80), s(120)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {destinationDetails?.photos ? (
        <ImageView
          images={destinationDetails.photos.map(photo => ({uri: photo}))}
          imageIndex={0}
          visible={galleryVisible}
          onRequestClose={() => setGalleryVisible(false)}
          animationType="slide"
          presentationStyle="formSheet"
          backgroundColor={colors.darkgrey}
          swipeToCloseEnabled={true}
          HeaderComponent={HeaderComponent}
        />
      ) : null}
      <Animated.View style={{height: headerHeight}}>
        <ImageBackground
          style={[headerStyles.image]}
          source={{uri: destination?.photo}}>
          <View style={headerStyles.darken} />
        </ImageBackground>
        <Animated.View style={[headerStyles.container, {height: headerHeight}]}>
          <SafeAreaView>
            <View style={headerStyles.row}>
              <Icon
                icon={icons.back}
                onPress={() => {
                  StatusBar.setBarStyle('dark-content', true);
                  navigation.goBack();
                }}
                color={colors.white}
              />
              <Animated.Text
                style={[headerStyles.title, {opacity: topTitleOpacity}]}
                numberOfLines={1}>
                {destination?.name}
              </Animated.Text>
              <Icon
                size="m"
                icon={
                  bookmarks.some(bookmark => bookmark.id === destination?.id)
                    ? icons.bookmarked
                    : icons.bookmark
                }
                onPress={() =>
                  destination
                    ? handleBookmark(destination, bookmarks, setBookmarks)
                    : null
                }
                color={colors.white}
              />
            </View>
          </SafeAreaView>
          <Animated.View
            style={[headerStyles.bottom, {opacity: bottomTitleOpacity}]}>
            <Text size="l" weight="b" color={colors.white}>
              {destination?.name}
            </Text>
            <Icon
              size="l"
              icon={icons.gallery}
              color={colors.white}
              onPress={() => setGalleryVisible(true)}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[localStyles.scrollView, {minHeight: vs(800)}]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollPosition}}}],
          {useNativeDriver: false},
        )}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        <View style={overViewStyles.container}>
          <View style={overViewStyles.top}>
            <View style={overViewStyles.hours}>
              <Text color={colors.accent}>{`★ ${destination?.rating}/5`}</Text>
              <Text size="xs" weight="l" color={colors.darkgrey}>
                {`(${destination?.rating_count} ${strings.poi.reviews})`}
              </Text>
            </View>
            <View style={overViewStyles.separator} />
            <View style={overViewStyles.price}>
              {destination?.price ? (
                <>
                  <Text size="m" weight="b" color={colors.accent}>
                    {'$'.repeat(destination?.price)}
                  </Text>
                  <Text size="m" weight="b" color={colors.grey}>
                    {'$'.repeat(4 - destination?.price)}
                  </Text>
                </>
              ) : (
                <Text color={colors.grey}>{strings.poi.noPrice}</Text>
              )}
            </View>
            <View style={overViewStyles.separator} />
            <View style={overViewStyles.hours}>
              {destinationDetails?.hours.length === 7 ? (
                <>
                  {open ? (
                    <Text color={colors.green}>{strings.poi.open}</Text>
                  ) : (
                    <Text color={colors.red}>{strings.poi.closed}</Text>
                  )}

                  <Text size="xs" weight="l" color={colors.darkgrey}>
                    {
                      destinationDetails?.hours[(date.getDay() + 6) % 7].split(
                        ' ',
                      )[1]
                    }
                  </Text>
                </>
              ) : (
                <Text color={colors.grey}>{strings.poi.noHours}</Text>
              )}
            </View>
          </View>
          {destinationDetails?.description ? (
            <View style={overViewStyles.description}>
              <Text size="s" weight="l">
                {destinationDetails?.description}
              </Text>
            </View>
          ) : null}
        </View>
        {destination?.latitude && destination.longitude ? (
          <MapView
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setMapExpanded(!mapExpanded);
            }}
            style={[localStyles.map, {height: mapExpanded ? s(360) : s(180)}]}
            userInterfaceStyle={'light'}
            initialRegion={{
              latitude: destination.latitude,
              longitude: destination.longitude,
              latitudeDelta: numbers.defaultLatitudeDelta,
              longitudeDelta: numbers.defaultLongitudeDelta,
            }}>
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
            />
          </MapView>
        ) : null}
        <View style={infoStyles.container}>
          <View style={localStyles.title}>
            <Text>{strings.poi.info}</Text>
          </View>
          {destinationDetails?.hours.length === 7 ? (
            <View style={infoStyles.row}>
              <View style={infoStyles.texts}>
                <Text size="s">{strings.poi.hours}:</Text>
                <View style={infoStyles.info}>
                  {hoursExpanded ? (
                    destinationDetails?.hours.map(
                      (hour: string, index: number) => (
                        <Text
                          key={index}
                          size="s"
                          weight={
                            index === (date.getDay() + 6) % 7 ? 'r' : 'l'
                          }>
                          {hour.replace(',', '').split(' ')[1] +
                            ' (' +
                            hour?.split(' ')[0].slice(0, -1) +
                            ')'}
                        </Text>
                      ),
                    )
                  ) : (
                    <Text size="s" weight="l">
                      {destinationDetails?.hours[(date.getDay() + 6) % 7]
                        .replace(',', '')
                        .split(' ')[1] +
                        ' (' +
                        destinationDetails?.hours[(date.getDay() + 6) % 7]
                          ?.split(' ')[0]
                          .slice(0, -1) +
                        ')'}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={[infoStyles.drop, hoursExpanded ? styles.flip : null]}>
                <Icon
                  size="s"
                  icon={icons.drop}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setHoursExpanded(!hoursExpanded);
                  }}
                />
              </View>
            </View>
          ) : null}
          {destinationDetails?.address !== '' ? (
            <View style={infoStyles.row}>
              <View style={infoStyles.texts}>
                <Text size="s">{strings.poi.address}:</Text>
                <View style={infoStyles.info}>
                  <Text size="s" weight="l">
                    {destinationDetails?.address}
                  </Text>
                </View>
              </View>
              <Icon icon={icons.map} button={true} onPress={handleMapPress} />
            </View>
          ) : null}
          {destinationDetails?.phone !== '' ? (
            <View style={infoStyles.row}>
              <View style={infoStyles.texts}>
                <Text size="s">{strings.poi.phone}:</Text>
                <View style={infoStyles.info}>
                  <Text size="s" weight="l">
                    {destinationDetails?.phone}
                  </Text>
                </View>
              </View>
              <Icon
                icon={icons.call}
                padding={-2}
                button={true}
                onPress={handleCallPress}
              />
            </View>
          ) : null}
          {destinationDetails?.website !== '' ? (
            <View style={infoStyles.row}>
              <View style={infoStyles.texts}>
                <Text size="s">{strings.poi.website}:</Text>
                <View style={infoStyles.info}>
                  <Text size="s" weight="l">
                    {destinationDetails?.website}
                  </Text>
                </View>
              </View>
              <Icon
                icon={icons.open}
                padding={-2}
                button={true}
                onPress={handleWebsitePress}
              />
            </View>
          ) : null}
          {destinationDetails && destinationDetails.attributes.length > 0 ? (
            <View style={infoStyles.row}>
              <View style={infoStyles.texts}>
                <Text size="s">{strings.poi.attributes}:</Text>
                <View style={infoStyles.info}>
                  {destinationDetails.attributes.map(
                    (attribute: string, index: number) => (
                      <Text key={index} size="s" weight="l">
                        {'・' + attribute}
                      </Text>
                    ),
                  )}
                </View>
              </View>
            </View>
          ) : null}
        </View>
        <View style={reviewStyles.container}>
          <View style={localStyles.title}>
            <Text>{strings.poi.reviews}</Text>
          </View>
          {destinationDetails?.reviews.map((review: Review, index: number) => (
            <View key={index} style={reviewStyles.row}>
              <View style={reviewStyles.reviewerContainer}>
                <View style={reviewStyles.reviewerContainer}>
                  <Image
                    style={reviewStyles.reviewer}
                    source={{uri: review.profile_photo_url}}
                  />
                </View>
                <View style={reviewStyles.texts}>
                  <Text size="s">{review.author_name}</Text>
                  <Text size="s" weight="l" color={colors.darkgrey}>
                    {`Rating: ${review.rating}/5・${review.relative_time_description}`}
                  </Text>
                </View>
              </View>
              <Text size="s" weight="l">
                {review.text}
              </Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      <TouchableOpacity
        style={[localStyles.button, styles.shadow]}
        onPress={() => {
          if (mode === 'create') {
            navigation.navigate('Create', {
              destination: destination,
            });
          } else if (mode === 'suggest') {
            navigation.navigate('Event', {
              destination: destination,
            });
          } else if (mode === 'add') {
            navigation.navigate('EventSettings', {destination});
          } else {
            // mode is none, create a fresh event with this destination
            navigation.navigate('Create', {
              destination: destination,
            });
          }
        }}>
        <Text size="m" color={colors.white}>
          {getButtonString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: s(40),
    width: s(75),
    height: s(40),
    borderRadius: s(10),
    backgroundColor: colors.accent,
  },
  imageTitle: {
    marginTop: s(10),
  },
  closeGallery: {
    position: 'absolute',
    top: s(2.5),
    right: s(20),
  },
  map: {
    width: '100%',
  },
  title: {
    marginBottom: s(5),
  },
  scrollView: {
    paddingBottom: s(50),
  },
});

const headerStyles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  darken: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: s(5),
    marginBottom: s(15),
  },
  title: {
    fontSize: s(16),
    fontWeight: '700',
    fontFamily: 'Lato',
    color: colors.white,
    maxWidth: s(280),
    paddingHorizontal: s(10),
  },
});

const overViewStyles = StyleSheet.create({
  container: {
    marginHorizontal: s(20),
    marginVertical: s(10),
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: s(45),
    paddingHorizontal: s(20),
    paddingVertical: s(5),
    marginVertical: s(5),
  },
  separator: {
    width: 1,
    backgroundColor: colors.grey,
  },
  description: {
    paddingVertical: s(5),
    paddingHorizontal: s(10),
    borderTopWidth: 1,
    borderColor: colors.grey,
  },
  hours: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const infoStyles = StyleSheet.create({
  container: {
    marginTop: s(20),
    marginHorizontal: s(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderColor: colors.grey,
    padding: s(10),
  },
  texts: {
    flex: 1,
    marginRight: s(5),
  },
  info: {
    marginTop: s(5),
    marginLeft: s(5),
  },
  drop: {
    marginRight: s(10),
  },
});

const reviewStyles = StyleSheet.create({
  container: {
    marginTop: s(20),
    marginHorizontal: s(20),
  },
  row: {
    borderTopWidth: 0.5,
    borderColor: colors.grey,
    padding: s(10),
  },
  reviewerContainer: {
    flexDirection: 'row',
    marginBottom: s(5),
  },
  reviewer: {
    width: s(40),
    height: s(40),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  texts: {
    marginLeft: s(10),
    height: s(40),
    justifyContent: 'space-evenly',
  },
});

export default PoiDetailPage;
