import React from 'react';
import {StyleSheet, View, Image, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import strings from '../../constants/strings';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';

import Icon from './Icon';
import Text from './Text';

import {Category, Coordinate, Poi} from '../../utils/types';
import {getDistanceFromCoordinates} from '../../utils/Misc';

interface Props {
  poi: Poi;
  bookmarked: boolean;
  handleBookmark: (poi: Poi) => void;
  location?: Coordinate;
  category?: Category;
}

const PoiRow: React.FC<Props> = ({
  poi,
  bookmarked,
  handleBookmark,
  location,
  category,
}) => {
  const theme = useColorScheme() || 'light';

  const getAddressString = (): string => {
    let poiString: string = '';

    if (poi.latitude && poi.longitude && location) {
      poiString += `${(
        getDistanceFromCoordinates(
          {latitude: poi.latitude, longitude: poi.longitude},
          location,
        ) / numbers.milesToMeters
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
          source={
            poi.photo
              ? {uri: poi.photo}
              : category
              ? {uri: category.icon.url}
              : icons.placeholder
          }
          resizeMode={poi.photo || !category ? 'cover' : 'contain'}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text size="s" numberOfLines={1}>
          {poi.name}
        </Text>
        <Text size="xs" weight="l" numberOfLines={1}>
          {getAddressString()}
        </Text>
        <Text size="xs">{getInfoString()}</Text>
      </View>
      <Icon
        size="l"
        icon={bookmarked ? icons.bookmarked : icons.bookmark}
        color={bookmarked ? colors[theme].accent : colors[theme].neutral}
        onPress={() => handleBookmark(poi)}
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
