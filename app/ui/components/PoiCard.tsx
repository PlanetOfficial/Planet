import React from 'react';
import {StyleSheet, View, Image, Alert} from 'react-native';

import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import strings from '../../constants/strings';
import icons from '../../constants/icons';

import Icon from './Icon';
import Text from './Text';

import {Category, Coordinate, Poi} from '../../utils/types';
import {getDistanceFromCoordinates} from '../../utils/Misc';
import {bookmark} from '../../utils/api/bookmarkAPI';
import {conversion} from '../../constants/numbers';

interface Props {
  poi: Poi;
  bookmarked: boolean;
  location?: Coordinate;
  category: Category;
}

const PoiCard: React.FC<Props> = ({poi, bookmarked, location, category}) => {
  const handleBookmark = async () => {
    const response: boolean = await bookmark(poi);
    if (!bookmarked) {
      if (response) {
        console.log('bookmarked');
      } else {
        Alert.alert('Error', 'Unable to bookmark place. Please try again.');
      }
    } else {
      if (response) {
        console.log('unbookmarked');
      } else {
        Alert.alert('Error', 'Unable to unbookmark place. Please try again.');
      }
    }
  };

  const getAddressString = (): string => {
    let poiString: string = '';

    if (poi.latitude && poi.longitude && location) {
      poiString += `${(
        getDistanceFromCoordinates(
          {latitude: poi.latitude, longitude: poi.longitude},
          location,
        ) / conversion.milesToMeters
      ).toFixed(1)} ${strings.main.milesAbbrev}`;
    }

    if (poi.vicinity) {
      poiString += '・' + poi.vicinity;
    }

    return poiString;
  };

  const getInfoString = (): string => {
    let poiString: string = '';

    if (poi.rating && poi.rating_count) {
      poiString += `★ ${poi.rating}  (${poi.rating_count})`;
    }

    if (poi.price) {
      poiString += '・' + '$'.repeat(poi.price);
    }

    return poiString;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{uri: poi.photo ? poi.photo : category.icon.url}}
          resizeMode={poi.photo ? 'cover' : 'contain'}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text size="s" numberOfLines={1}>
          {poi.name}
        </Text>
        <Text size="xs" weight="l" color={colors.darkgrey} numberOfLines={1}>
          {getAddressString()}
        </Text>
        <Text size="xs" color={colors.darkgrey}>
          {getInfoString()}
        </Text>
      </View>
      <Icon
        size="l"
        icon={bookmarked ? icons.bookmarked : icons.bookmark}
        color={bookmarked ? colors.accent : colors.black}
        onPress={handleBookmark}
      />
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
  },
  infoContainer: {
    flex: 1,
    paddingLeft: s(10),
    paddingRight: s(5),
    justifyContent: 'space-between',
    height: s(54),
  },
});

export default PoiCard;
