import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {ScrollView} from 'react-native-gesture-handler';
import {showLocation} from 'react-native-map-link';

import strings from '../../constants/strings';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import {floats} from '../../constants/numbers';

import {getDestination} from '../../utils/api/destinationAPI';
import {postPlace, deletePlace} from '../../utils/api/placeAPI';

import Icon from '../components/Icon';
import Text from '../components/Text';
import OptionMenu from '../components/OptionMenu';

import {
  Place as PlaceT,
  PlaceDetail,
  Review,
} from '../../utils/interfaces/types';
import {getPlaceCardString} from '../../utils/functions/Misc';

interface Props {
  navigation: any;
  route: any;
}

const Place: React.FC<Props> = ({navigation, route}) => {
  const [destination] = useState<PlaceT>(route.params.destination);
  const [destinationDetails, setDestinationDetails] = useState<PlaceDetail>();
  const [bookmarked, setBookmarked] = useState<boolean>(
    route?.params?.bookmarked,
  );

  useEffect(() => {
    const initializeDestinationData = async () => {
      const details: PlaceDetail | null = await getDestination(
        destination.place_id,
        destination.supplier,
      );

      if (details) {
        setDestinationDetails(details);
      } else {
        Alert.alert(
          'Error',
          'Unable to load destination details. Please try again.',
        );
      }
    };

    initializeDestinationData();
  }, [destination.place_id, destination.supplier]);

  const handleMapPress = async () => {
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

  const handleLinkPress = async () => {
    if (destinationDetails?.url) {
      await Linking.openURL(destinationDetails.url);
    }
  };

  const handleWebsitePress = async () => {
    if (destinationDetails?.website) {
      await Linking.openURL(destinationDetails.website);
    }
  };

  const handleBookmark = async () => {
    if (!bookmarked) {
      const response: boolean = await postPlace(destination.id);

      if (response) {
        setBookmarked(!bookmarked);
      } else {
        Alert.alert('Error', 'Unable to bookmark place. Please try again.');
      }
    } else {
      const response: boolean = await deletePlace(destination.id);

      if (response) {
        setBookmarked(!bookmarked);
      } else {
        Alert.alert('Error', 'Unable to unbookmark place. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon icon={icons.back} onPress={navigation.goBack} />
          <View style={headerStyles.texts}>
            <Text weight="b" numberOfLines={1}>
              {destination.name}
            </Text>
            <Text size="xs" weight="l" color={colors.accent} numberOfLines={1}>
              {getPlaceCardString(destination)}
            </Text>
          </View>
          <OptionMenu
            options={[
              {
                name: strings.library.createEvent,
                onPress: () => {
                  navigation.navigate('MapSelection', {
                    destination: destination,
                  });
                },
                color: colors.accent,
              },
              {
                name: bookmarked
                  ? strings.library.unbookmark
                  : strings.library.bookmark,
                onPress: handleBookmark,
                color: colors.accent,
              },
              {
                name: strings.main.share,
                onPress: () => {
                  Alert.alert('Share', 'Coming Soon');
                },
                color: colors.black,
              },
              {
                name: strings.createTabStack.openMap,
                onPress: handleMapPress,
                color: colors.black,
              },
              {
                name: strings.createTabStack.eventUrl,
                onPress: handleLinkPress,
                color: colors.black,
              },
            ]}
          />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollView}>
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
            {destinationDetails?.photos ? (
              destinationDetails?.photos.map((photo: string, index: number) => (
                <View key={index}>
                  <Image source={{uri: photo}} style={styles.image} />
                </View>
              ))
            ) : destination?.photo ? (
              <Image source={{uri: destination.photo}} style={styles.image} />
            ) : null}
          </ScrollView>
          <View style={styles.separator} />
        </>
        {destinationDetails?.description ? (
          <View style={detailStyles.infoContainer}>
            <Text size="s">{strings.createTabStack.description}:</Text>
            <Text size="xs" weight="l">
              {destinationDetails?.description}
            </Text>
          </View>
        ) : null}
        {destinationDetails?.address ? (
          <View style={detailStyles.infoContainer}>
            <Text size="s">{strings.createTabStack.address}:</Text>
            <Text size="xs" weight="l">
              {destinationDetails?.address}
            </Text>
          </View>
        ) : null}
        {destinationDetails?.hours ? (
          <View style={detailStyles.infoContainer}>
            <Text size="s">{strings.createTabStack.hours}:</Text>
            {destinationDetails?.hours.map((hour: string, index: number) => (
              <Text key={index} size="xs" weight="l">
                {hour}
              </Text>
            ))}
          </View>
        ) : null}
        {destinationDetails?.phone ? (
          <View style={detailStyles.infoContainer}>
            <Text size="s">{strings.createTabStack.phone}:</Text>
            <TouchableOpacity onPress={handleCallPress}>
              <Text size="xs" weight="l">
                {destinationDetails?.address}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {destinationDetails?.url ? (
          <View style={detailStyles.infoContainer}>
            <Text size="s">{strings.createTabStack.url}:</Text>
            <TouchableOpacity onPress={handleLinkPress}>
              <Text size="xs" weight="l">
                {destinationDetails?.url}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {destinationDetails?.website ? (
          <View style={detailStyles.infoContainer}>
            <Text size="s">{strings.createTabStack.website}:</Text>
            <TouchableOpacity onPress={handleWebsitePress}>
              <Text size="xs" weight="l">
                {destinationDetails?.website}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {destinationDetails?.attributes &&
        Array.isArray(destinationDetails.attributes) &&
        destinationDetails.attributes.length > 0 ? (
          <View style={detailStyles.infoContainer}>
            <Text size="s">{strings.createTabStack.attributes}:</Text>
            {destinationDetails.attributes.map(
              (attribute: string, index: number) => (
                <Text key={index} size="xs" weight="l">
                  {attribute}
                </Text>
              ),
            )}
          </View>
        ) : null}
        {destinationDetails?.reviews &&
        Array.isArray(destinationDetails?.reviews) &&
        destinationDetails?.reviews.length > 0 ? (
          <>
            <View style={styles.separator} />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}>
              {destinationDetails.reviews.map(
                (review: Review, index: number) => (
                  <View key={index} style={detailStyles.reviewContainer}>
                    <Text size="xs" numberOfLines={20}>
                      {review.text + ' (' + review.rating + '/5)'}
                    </Text>
                    <Text size="xs" color={colors.darkgrey}>
                      {review.relative_time_description}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>
          </>
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
  scrollView: {
    paddingBottom: s(20),
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
  reviewContainer: {
    padding: s(10),
    width: s(180),
    backgroundColor: colors.grey,
    borderRadius: s(10),
    marginRight: s(10),
  },
});

export default Place;
