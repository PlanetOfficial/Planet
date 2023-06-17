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
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import {showLocation} from 'react-native-map-link';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {Poi, PoiDetail, Review} from '../../utils/types';
import {getPoi, postPoi} from '../../utils/api/poiAPI';
import {handleBookmark} from '../../utils/Misc';

const PoiDetailPage = ({navigation, route}: {navigation: any; route: any}) => {
  StatusBar.setBarStyle('light-content', true);
  const date = new Date();

  const [destination, setDestination] = useState<Poi>(route.params.poi);
  const [destinationDetails, setDestinationDetails] = useState<PoiDetail>();

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const [mode] = useState<string>(route.params.mode);

  const [mapExpanded, setMapExpanded] = useState<boolean>(false);

  const initializeBookmarks = useCallback(async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  }, []);

  const initializeDestinationData = useCallback(async () => {
    if (route.params?.place_id) {
      const result = await postPoi(route.params.place_id);
      if (result) {
        setDestination(result.poi);
        setDestinationDetails(result.poiDetail);
      } else {
        Alert.alert(strings.error.error, strings.error.loadDestinationDetails);

      }
    } else {
      const details: PoiDetail | null = await getPoi(
        destination.place_id,
        destination.supplier,
      );

      if (details) {
        setDestinationDetails(details);
      } else {
        Alert.alert(strings.error.error, strings.error.loadDestinationDetails);

      }
    }
  }, [destination.place_id, destination.supplier, route.params?.place_id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeBookmarks();
      initializeDestinationData();
    });

    return unsubscribe;
  }, [navigation, initializeBookmarks, initializeDestinationData]);

  const handleMapPress = async () => {
    showLocation({
      latitude: destination?.latitude,
      longitude: destination?.longitude,
      title: destination?.name,
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

  const insets = useSafeAreaInsets();
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollPosition.interpolate({
    inputRange: [s(40), s(170)],
    outputRange: [insets.top + s(170), insets.top + s(40)],
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

  // TODO: photo viewer somewhere
  // TODO: map expand animation

  return (
    <View style={styles.container}>
      <Animated.View style={{height: headerHeight}}>
        <ImageBackground
          style={[headerStyles.image]}
          source={{uri: destination.photo}}>
          <View style={headerStyles.darken} />
        </ImageBackground>
        <Animated.View style={[headerStyles.container, {height: headerHeight}]}>
          <SafeAreaView>
            <View style={headerStyles.row}>
              <Icon
                icon={icons.back}
                onPress={navigation.goBack}
                color={colors.white}
              />
              <Animated.Text
                style={[headerStyles.titleTop, {opacity: topTitleOpacity}]}>
                {destination?.name}
              </Animated.Text>
              <Icon
                size="m"
                icon={
                  bookmarks.some(bookmark => bookmark.id === destination.id)
                    ? icons.bookmarked
                    : icons.bookmark
                }
                onPress={() => {
                  handleBookmark(destination, bookmarks, setBookmarks);
                }}
                color={colors.white}
              />
            </View>
          </SafeAreaView>
          <Animated.Text
            style={[headerStyles.titleBottom, {opacity: bottomTitleOpacity}]}>
            {destination?.name}
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[styles.scrollView, {minHeight: vs(800)}]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollPosition}}}],
          {useNativeDriver: false},
        )}
        bounces={false}
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
                  {/* TODO: Change accordingly */}
                  <Text color={colors.red}>Closed</Text>
                  <Text size="xs" weight="l" color={colors.darkgrey}>
                    {destinationDetails?.hours[(date.getDay() + 6) % 7].split(' ')[1]}
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
        {destination.latitude && destination.longitude ? (
          <MapView
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
            <Icon
              icon={mapExpanded ? icons.shrink : icons.expand}
              button={true}
              onPress={() => setMapExpanded(!mapExpanded)}
            />
          </MapView>
        ) : null}
        <View style={infoStyles.container}>
          <Text>{strings.poi.info}</Text>
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
          {destinationDetails?.hours.length === 7 ? (
            <View style={infoStyles.row}>
              <View style={infoStyles.texts}>
                <Text size="s">{strings.poi.hours}:</Text>
                <View style={infoStyles.info}>
                  <Text size="s" weight="l">
                    {destinationDetails?.hours[(date.getDay() + 6) % 7].split(
                      ' ',
                    )[1] +
                      ' (' +
                      destinationDetails?.hours[(date.getDay() + 6) % 7]
                        ?.split(' ')[0]
                        .slice(0, -1) +
                      ')'}
                  </Text>
                </View>
              </View>
              <Icon
                icon={icons.clock}
                button={true}
                onPress={() => {
                  // TODO: Open hours
                }}
              />
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
            navigation.navigate('EventSettings', {
              destination: destination,
            });
          } else { // mode is none, create a fresh event with this destination
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
  map: {
    width: '100%',
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
  titleTop: {
    fontSize: s(16),
    fontWeight: '700',
    fontFamily: 'Lato',
    color: colors.white,
  },
  titleBottom: {
    marginLeft: s(5),
    marginBottom: s(15),
    fontSize: s(19),
    fontWeight: '800',
    fontFamily: 'Lato',
    color: colors.white,
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
    margin: s(20),
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
});

export default PoiDetailPage;
