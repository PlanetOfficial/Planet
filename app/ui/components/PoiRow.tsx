import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';

import strings from '../../constants/strings';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';

import Text from './Text';
import BookmarkIcon from './BookmarkIcon';

import {Category, Coordinate, Poi} from '../../utils/types';
import {getDistanceFromCoordinates} from '../../utils/Misc';

interface Props {
  place: Poi;
  myLocation?: Coordinate;
  category?: Category;
}

const PoiRow: React.FC<Props> = ({place, myLocation, category}) => {
  const getAddressString = (): string => {
    let poiString: string = '';

    if (place.latitude && place.longitude && myLocation) {
      poiString += `${(
        getDistanceFromCoordinates(
          {latitude: place.latitude, longitude: place.longitude},
          myLocation,
        ) / numbers.milesToMeters
      ).toFixed(1)} ${strings.main.milesAbbrev}`;
    }

    if (place.vicinity) {
      poiString += '・' + place.vicinity;
    }

    return poiString;
  };

  const getInfoString = (): string => {
    let poiString: string = '';

    if (place.rating && place.rating_count) {
      poiString += `★ ${place.rating}  (${place.rating_count})`;
    }

    if (place.price) {
      poiString += '・' + '$'.repeat(place.price);
    }

    if (place.display_date) {
      poiString += place.display_date;
    }

    return poiString;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={
            place.photo
              ? {uri: place.photo}
              : category
              ? {uri: category.icon.url}
              : icons.placeholder
          }
          resizeMode={place.photo || !category ? 'cover' : 'contain'}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text size="s" numberOfLines={1}>
          {place.name}
        </Text>
        <Text size="xs" weight="l" numberOfLines={1}>
          {getAddressString()}
        </Text>
        <Text size="xs">{getInfoString()}</Text>
      </View>
      <BookmarkIcon place={place} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    marginVertical: s(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: s(96),
    height: s(64),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: s(5),
  },
  infoContainer: {
    flex: 1,
    height: s(64),
    paddingLeft: s(10),
    paddingRight: s(5),
    justifyContent: 'space-evenly',
  },
});

export default PoiRow;
