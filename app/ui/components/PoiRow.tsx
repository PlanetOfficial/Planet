import React from 'react';
import {Image, StyleSheet, View, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import strings from '../../constants/strings';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';

import Icon from './Icon';
import Text from './Text';

import {Category, Coordinate, Poi} from '../../utils/types';
import {
  getDistanceFromCoordinates,
  handleBookmark,
  useLoadingState,
} from '../../utils/Misc';

import {useBookmarkContext} from '../../context/BookmarkContext';

interface Props {
  place: Poi;
  bookmarked: boolean;
  myLocation?: Coordinate;
  category?: Category;
}

const PoiRow: React.FC<Props> = ({place, bookmarked, myLocation, category}) => {
  const theme = useColorScheme() || 'light';

  const {bookmarks, setBookmarks} = useBookmarkContext();
  const [loading, withLoading] = useLoadingState();

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
      <Icon
        size="l"
        disabled={loading}
        icon={bookmarked ? icons.bookmarked : icons.bookmark}
        color={bookmarked ? colors[theme].accent : colors[theme].neutral}
        onPress={() =>
          withLoading(() => handleBookmark(place, bookmarks, setBookmarks))
        }
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
