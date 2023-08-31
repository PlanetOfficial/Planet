import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Animated,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import ImageView from 'react-native-image-viewing';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {useBookmarkContext} from '../../../context/BookmarkContext';

import {
  Coordinate,
  ExploreModesWithInCreate,
  Poi,
  PoiDetail,
} from '../../../utils/types';
import {getPoi, postPoi} from '../../../utils/api/poiAPI';
import {fetchUserLocation} from '../../../utils/Misc';

import Header from './Header';
import Overview from './Overview';
import Map from './Map';
import Info from './Info';
import Reviews from './Reviews';
import Button from './Button';

const PoiPage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: ExploreModesWithInCreate;
      place_id?: string;
      poi?: Poi;
      category?: string;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors.dark.statusBar, true);

  const [destination, setDestination] = useState<Poi>();
  const [destinationDetails, setDestinationDetails] = useState<PoiDetail>();
  const [mode] = useState<ExploreModesWithInCreate>(route.params.mode);

  const {bookmarks, setBookmarks} = useBookmarkContext();

  const [location, setLocation] = useState<Coordinate>();

  const initializeDestinationData = useCallback(async () => {
    if (route.params.place_id) {
      const result = await postPoi(route.params.place_id);
      if (result) {
        setDestination(result.poi);
        setDestinationDetails(result.poiDetail);
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
      } else {
        Alert.alert(strings.error.error, strings.error.loadDestinationDetails);
      }
    }
  }, [route.params.poi, route.params.place_id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeDestinationData();
      setLocation(await fetchUserLocation());
    });

    return unsubscribe;
  }, [navigation, initializeDestinationData]);

  const scrollPosition = useRef(new Animated.Value(0)).current;
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const HeaderComponent = useCallback(
    () => (
      <View style={styles.imageTitle}>
        <Text center={true} color={colors.light.primary}>
          {strings.poi.images}
        </Text>
        <View style={styles.closeGallery}>
          <Icon
            icon={icons.close}
            color={colors.light.primary}
            onPress={() => setGalleryVisible(false)}
          />
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={STYLES.container}>
      {destinationDetails?.photos ? (
        <ImageView
          images={destinationDetails.photos.map(photo => ({uri: photo}))}
          imageIndex={0}
          visible={galleryVisible}
          onRequestClose={() => setGalleryVisible(false)}
          animationType="slide"
          presentationStyle="formSheet"
          backgroundColor={colors.dark.secondary}
          swipeToCloseEnabled={true}
          HeaderComponent={HeaderComponent}
        />
      ) : null}
      <Header
        navigation={navigation}
        scrollPosition={scrollPosition}
        destination={destination}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        setGalleryVisible={setGalleryVisible}
      />

      <Animated.ScrollView
        contentContainerStyle={[styles.scrollView, {minHeight: vs(800)}]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollPosition}}}],
          {useNativeDriver: false},
        )}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        {destination && destinationDetails ? (
          <Overview
            destination={destination}
            destinationDetails={destinationDetails}
          />
        ) : null}
        {destination?.latitude && destination.longitude ? (
          <Map
            latitude={destination.latitude}
            longitude={destination.longitude}
          />
        ) : null}
        {destination && destinationDetails && location ? (
          <Info
            destination={destination}
            destinationDetails={destinationDetails}
            location={location}
          />
        ) : null}
        {destinationDetails?.reviews &&
        destinationDetails?.reviews?.length > 0 ? (
          <Reviews reviews={destinationDetails?.reviews} />
        ) : null}
      </Animated.ScrollView>

      {mode !== 'inCreate' ? (
        <Button
          navigation={navigation}
          destination={destination}
          mode={mode}
          category={route.params.category}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  imageTitle: {
    marginTop: s(10),
  },
  closeGallery: {
    position: 'absolute',
    top: s(2.5),
    right: s(20),
  },
  scrollView: {
    paddingBottom: s(50),
  },
});

export default PoiPage;
