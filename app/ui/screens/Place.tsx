import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import misc from '../../constants/misc';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import strings from '../../constants/strings';
import {floats} from '../../constants/numbers';
import {s} from 'react-native-size-matters';
import { getPlaceDetails } from '../../utils/api/shared/getPlaceDetails';
import { capitalizeFirstLetter, convertDateToMMDDYYYY, convertTimeTo12Hour, displayAddress, displayHours } from '../../utils/functions/Misc';

const Place = ({navigation, route}: {navigation: any; route: any}) => {
  const [destination] = useState(route?.params?.destination);
  const [destinationDetails, setDestinationDetails]: any = useState({});
  const [category] = useState(route?.params?.category);

  const getImageURL = (prefix: String, suffix: String) => {
    return prefix + misc.imageSize + suffix;
  };

  useEffect(() => {
    const initializeDestinationData = async () => {
      const id = route?.params?.destination?.id;
      if (id) {
        const details = await getPlaceDetails(id);
        setDestinationDetails(details);
      }
    }
    
    initializeDestinationData();
  }, [])

  const handleLinkPress = async () => {
    if (destinationDetails?.event_url) {
      const linkingSupported = await Linking.canOpenURL(destinationDetails?.event_url);

      if (linkingSupported) {
        await Linking.openURL(destinationDetails?.event_url);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.next}
          onPress={() => navigation.goBack()}>
          <Image style={headerStyles.icon} source={icons.next} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          <Text style={headerStyles.title}>{destination?.name}</Text>
          <Text style={headerStyles.info}>
            {category}
            {destination?.price ? '・' + destination?.price : null}
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: destination?.latitude,
            longitude: destination?.longitude,
            latitudeDelta: floats.defaultLatitudeDelta,
            longitudeDelta: floats.defaultLongitudeDelta,
          }}>
          <Marker
            coordinate={{
              latitude: destination?.latitude,
              longitude: destination?.longitude,
            }}
          />
        </MapView>
        <View style={styles.separator} />
          <>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}>
            {destinationDetails?.images?.length > 0 ? destinationDetails?.images?.map((image: any, index: number) => (
              <View key={index}>
                <Image
                  source={{uri: image}}
                  style={styles.image}
                />
              </View>
            )) : destination?.image_url ? (<Image source={{uri : destination?.image_url}} style={styles.image}/>) : null}
          </ScrollView>
          <View style={styles.separator} />
          </>
        <View>
          {destinationDetails?.rating >= 0 || destinationDetails?.reviews?.length > 0 ? (
            <>
              <Text style={rnrStyles.title}>
                {strings.createTabStack.rnr}
                {':'}
                {destinationDetails?.rating >= 0 ? (
                  <>
                    {' ('}
                    <Text style={rnrStyles.rating}>{destinationDetails?.rating}</Text>
                    {'/' + strings.misc.maxRating + ')'}
                  </>
                ) : null}
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={rnrStyles.contentContainer}>
                {destinationDetails?.reviews
                  ? destinationDetails?.reviews?.map((review: any, index: number) => (
                      <View key={index} style={rnrStyles.review}>
                        <Text style={rnrStyles.text}>{review?.text}</Text>
                      </View>
                    ))
                  : null}
              </ScrollView>
              <View style={styles.separator} />
            </>
          ) : null}
        </View>
        <View style={detailStyles.container}>
          <Text style={detailStyles.title}>
            {strings.createTabStack.details}:
          </Text>
          {destinationDetails?.hours?.length > 0 ? (
            <View style={detailStyles.infoContainer}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.hours}:
              </Text>
              <Text style={detailStyles.info}>
                {displayHours(destinationDetails?.hours)}
              </Text>
            </View>
          ) : null}
          {destinationDetails?.event_venue_name ? (
            <View style={detailStyles.infoContainer}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.venue}:
              </Text>
              <Text style={detailStyles.info}>
                {destinationDetails?.event_venue_name}
              </Text>
            </View>
          ) : null}
          {destinationDetails?.address ? (
            <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.address}:
            </Text>
            <Text style={detailStyles.info}>
              {displayAddress(destinationDetails?.address)}
            </Text>
          </View>
          ) : null}
          {destinationDetails?.event_start_info?.localDate && destinationDetails?.event_start_info?.localTime ? (
            <View style={detailStyles.infoContainer}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.eventTime}:
              </Text>
              <Text style={detailStyles.info}>
                {convertDateToMMDDYYYY(destinationDetails?.event_start_info?.localDate) + '\n'}
                {convertTimeTo12Hour(destinationDetails?.event_start_info?.localTime)}
              </Text>
            </View>
          ) : null}
          {destinationDetails?.event_status?.code ? (
            <View style={detailStyles.infoContainer}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.eventStatus}:
              </Text>
              <Text style={detailStyles.info}>
                {capitalizeFirstLetter(destinationDetails?.event_status?.code)}
              </Text>
            </View>
          ) : null}
          {destinationDetails?.event_span ? (
            <View style={detailStyles.infoContainer}>
              <Text style={detailStyles.info}>
                {strings.createTabStack.eventSpan}
              </Text>
            </View>
          ) : null}
          {destinationDetails?.event_url ? (
            <View style={detailStyles.infoContainer}>
              <TouchableOpacity onPress={() => handleLinkPress()}>
                <Text style={detailStyles.infoTitle}>
                  {strings.createTabStack.eventUrl}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '105%',
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
    marginLeft: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  info: {
    marginTop: s(5),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.accent,
  },
  next: {
    width: s(18),
    height: s(18),
    transform: [{rotate: '180deg'}],
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const rnrStyles = StyleSheet.create({
  contentContainer: {
    marginLeft: s(20),
  },
  title: {
    marginLeft: s(20),
    fontSize: s(16),
    fontWeight: '600',
    color: colors.black,
  },
  rating: {
    fontSize: s(18),
    fontWeight: '800',
    color: colors.accent,
  },
  review: {
    width: s(160),
    padding: s(10),
    borderRadius: s(10),
    backgroundColor: colors.grey,
    marginRight: s(10),
    marginTop: s(5),
  },
  text: {
    fontSize: s(12),
    fontWeight: '500',
    color: colors.black,
  },
});

const detailStyles = StyleSheet.create({
  container: {
    marginBottom: s(50),
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
