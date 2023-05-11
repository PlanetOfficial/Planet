import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {icons, brands, yelpStars} from '../../constants/images';
import {colors} from '../../constants/theme';
import {s} from 'react-native-size-matters';
import strings from '../../constants/strings';
import {floats} from '../../constants/numbers';
import {getPlaceDetails} from '../../utils/api/shared/getPlaceDetails';
import {
  capitalizeFirstLetter,
  convertDateToMMDDYYYY,
  convertTimeTo12Hour,
  displayAddress,
  displayHours,
} from '../../utils/functions/Misc';
import {ScrollView} from 'react-native-gesture-handler';
import {showLocation} from 'react-native-map-link';

import Icon from '../components/Icon';
import CustomText from '../components/Text';

import {Place as PlaceT, PlaceDetail} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  route: any;
}

const Place: React.FC<Props> = ({navigation, route}) => {
  const [destination] = useState<PlaceT>(route.params.destination);
  const [destinationDetails, setDestinationDetails] = useState<PlaceDetail>({
    additionalInfo: '',
    address: '',
    dates: {},
    description: '',
    hours: [],
    name: '',
    phone: '',
    photos: [],
    place_name: '',
    price: '',
    rating: -1,
    review_count: -1,
    url: '',
  });
  const [category] = useState<string>(route.params.category);

  useEffect(() => {
    const initializeDestinationData = async () => {
      const id = destination.id;
      if (id) {
        const details = await getPlaceDetails(id);
        setDestinationDetails(details);
        console.log(details.dates);
      }
    };

    initializeDestinationData();
  }, [destination.id]);

  const handleMapPress = async () => {
    showLocation({
      latitude: destination.latitude,
      longitude: destination.longitude,
      title: destination.name,
    });
  };

  const handleCallPress = async () => {
    if (destinationDetails.url) {
      await Linking.openURL(
        `tel:${
          destinationDetails.phone
            ? destinationDetails.phone.replace(/\D/g, '')
            : ''
        }`,
      );
    }
  };

  const handleLinkPress = async () => {
    if (destinationDetails.url) {
      await Linking.openURL(destinationDetails.url);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon size="s" icon={icons.back} onPress={navigation.goBack} />
          <View style={headerStyles.texts}>
            <CustomText weight="b">{destination.name}</CustomText>
            <CustomText size="xs" weight="l" color={colors.accent}>
              {category}
              {destinationDetails.price
                ? '・' + destinationDetails.price
                : null}
            </CustomText>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {destination.latitude && destination.longitude ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: destination.latitude,
              longitude: destination.longitude,
              latitudeDelta: floats.defaultLatitudeDelta,
              longitudeDelta: floats.defaultLongitudeDelta,
            }}>
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
            />
          </MapView>
        ) : null}
        <View style={styles.separator} />
        <>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}>
            {destinationDetails.photos.length > 0 ? (
              destinationDetails.photos.map((photo: string, index: number) => (
                <View key={index}>
                  <Image source={{uri: photo}} style={styles.image} />
                </View>
              ))
            ) : destination.image_url ? (
              <Image
                source={{uri: destination.image_url}}
                style={styles.image}
              />
            ) : null}
          </ScrollView>
          <View style={styles.separator} />
        </>
        {destinationDetails.rating > 0 ? (
          <View style={detailStyles.infoContainer}>
            <View style={detailStyles.row}>
              <View>
                <Text style={detailStyles.infoTitle}>
                  {strings.createTabStack.rating}:
                </Text>
                <View style={detailStyles.rating}>
                  <Image
                    style={detailStyles.stars}
                    source={yelpStars[destinationDetails.rating * 2]}
                  />
                  <CustomText
                    size="xs"
                    color={
                      colors.darkgrey
                    }>{`Based on ${destinationDetails.review_count} reviews`}</CustomText>
                </View>
              </View>
              <TouchableOpacity onPress={handleLinkPress}>
                <Image style={detailStyles.yelp} source={brands.yelpLogo} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {destinationDetails.dates.start?.localDate &&
          destinationDetails.dates.start?.localTime ? (
            <View style={detailStyles.infoContainer}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.eventTime}:
              </Text>
              <Text style={detailStyles.info}>
                {convertDateToMMDDYYYY(
                  destinationDetails.dates.start?.localDate,
                ) + '\n'}
                {convertTimeTo12Hour(
                  destinationDetails?.dates.start?.localTime,
                )}
              </Text>
            </View>
          ) : null}
        {destinationDetails.hours.length > 0 ? (
          <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.hours}:
            </Text>
            <Text style={detailStyles.info}>
              {displayHours(destinationDetails.hours)}
            </Text>
          </View>
        ) : null}
        {destinationDetails.description !== '' ? (
          <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.description}:
            </Text>
            <Text style={detailStyles.info}>
              {destinationDetails.description}
            </Text>
          </View>
        ) : null}
        {destinationDetails.additionalInfo !== '' ? (
          <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.additionalInfo}:
            </Text>
            <Text style={detailStyles.info}>
              {destinationDetails.additionalInfo}
            </Text>
          </View>
        ) : null}
        {destinationDetails.place_name ? (
          <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.venue}:
            </Text>
            <Text style={detailStyles.info}>
              {destinationDetails.place_name}
            </Text>
          </View>
        ) : null}
        {destinationDetails.address ? (
          <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.address}:
            </Text>
            <Text style={detailStyles.info}>
              {destinationDetails.address.replace(/\\n/g, '\n')}
            </Text>
          </View>
        ) : null}
        {destinationDetails.phone ? (
          <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.phone}:
            </Text>

            <TouchableOpacity onPress={handleCallPress}>
              <Text style={detailStyles.info}>{destinationDetails.phone}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {Platform.OS === 'ios' ? (
          <View style={detailStyles.infoContainer}>
            <TouchableOpacity onPress={handleMapPress}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.openMap}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {destinationDetails.url ? (
          <View style={detailStyles.infoContainer}>
            <TouchableOpacity onPress={handleLinkPress}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.eventUrl}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imagesContainer: {
    paddingLeft: s(20),
  },
  image: {
    marginRight: s(10),
    width: s(160),
    height: s(200),
    borderRadius: s(10),
  },
  map: {
    height: s(200),
    marginHorizontal: s(20),
    marginTop: s(10),
    borderRadius: s(10),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
    marginHorizontal: s(20),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingTop: s(10),
    paddingBottom: s(5),
  },
  texts: {
    flex: 1,
    marginHorizontal: s(10),
  },
});

const detailStyles = StyleSheet.create({
  container: {
    marginBottom: s(50),
  },
  rating: {
    marginTop: s(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stars: {
    width: s(132),
    height: s(24),
  },
  yelp: {
    width: s(75),
    height: s(29),
  },
  title: {
    marginLeft: s(20),
    fontSize: s(16),
    fontWeight: '600',
    color: colors.black,
  },
  infoContainer: {
    marginHorizontal: s(20),
    marginTop: s(5),
    marginBottom: s(10),
    padding: s(15),
    borderRadius: s(10),
    backgroundColor: colors.grey,
  },
  infoTitle: {
    fontSize: s(13),
    fontWeight: '600',
    color: colors.accent,
  },
  info: {
    marginTop: s(5),
    fontSize: s(13),
    fontWeight: '500',
    color: colors.black,
  },
});

export default Place;
