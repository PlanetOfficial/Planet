import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Alert, Animated} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from 'react-native-image-viewing';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {Poi, PoiDetail} from '../../../utils/types';
import {getPoi, postPoi} from '../../../utils/api/poiAPI';

import Header from './Header';
import Overview from './Overview';
import Map from './Map';
import Info from './Info';
import Reviews from './Reviews';
import Button from './Button';

const PoiDetailPage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: 'create' | 'suggest' | 'add' | 'none';
      place_id?: string;
      poi?: Poi;
    };
  };
}) => {
  const [destination, setDestination] = useState<Poi>();
  const [destinationDetails, setDestinationDetails] = useState<PoiDetail>();
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);
  const [mode] = useState<'create' | 'suggest' | 'add' | 'none'>(
    route.params.mode,
  );

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
    const unsubscribe = navigation.addListener('focus', () => {
      initializeBookmarks();
      initializeDestinationData();
    });

    return unsubscribe;
  }, [navigation, initializeBookmarks, initializeDestinationData]);

  const scrollPosition = useRef(new Animated.Value(0)).current;
  const [galleryVisible, setGalleryVisible] = useState(false);
  const HeaderComponent = useCallback(
    () => (
      <View style={styles.imageTitle}>
        <Text center={true} color={colors.white}>
          {strings.poi.images}
        </Text>
        <View style={styles.closeGallery}>
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
          backgroundColor={colors.darkgrey}
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
        {destination && destinationDetails ? (
          <Info
            destination={destination}
            destinationDetails={destinationDetails}
          />
        ) : null}
        {destinationDetails?.reviews &&
        destinationDetails?.reviews?.length > 0 ? (
          <Reviews reviews={destinationDetails?.reviews} />
        ) : null}
      </Animated.ScrollView>

      <Button navigation={navigation} destination={destination} mode={mode} />
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

export default PoiDetailPage;
