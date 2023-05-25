import React from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';

import {s} from 'react-native-size-matters';

import Text from '../components/Text';
import Icon from './Icon';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import {postPlace, deletePlace} from '../../utils/api/placeAPI';
import {Place} from '../../utils/interfaces/types';
import {getPlaceCardString} from '../../utils/functions/Misc';

interface Props {
  place: Place;
  bookmarked: boolean;
  setBookmarked: (bookmarked: boolean, place: Place) => void;
  image: ImageSourcePropType;
  small?: boolean;
  displayCategory?: boolean;
  displaySuggester?: boolean;
}

const PlaceCard: React.FC<Props> = ({
  place,
  bookmarked,
  setBookmarked,
  image,
  small = false,
  displayCategory = true,
  displaySuggester = false,
}) => {
  const handleBookmark = async () => {
    if (!bookmarked) {
      const response: boolean = await postPlace(place.id);

      if (response) {
        setBookmarked(!bookmarked, place);
      } else {
        Alert.alert('Error', 'Unable to bookmark place. Please try again.');
      }
    } else {
      const response: boolean = await deletePlace(place.id);

      if (response) {
        setBookmarked(!bookmarked, place);
      } else {
        Alert.alert('Error', 'Unable to unbookmark place. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.header}>
        <View style={styles.texts}>
          <Text size={small ? 's' : 'm'} weight="b" numberOfLines={1}>
            {place.name}
          </Text>
          <Text size="xs" weight="l" color={colors.accent} numberOfLines={1}>
            {(displaySuggester
              ? `${place.suggester?.name.split(' ')[0]} suggested | `
              : '') + getPlaceCardString(place, displayCategory)}
          </Text>
        </View>
        <Icon
          size="m"
          color={colors.accent}
          icon={bookmarked ? icons.hearted : icons.heart}
          onPress={handleBookmark}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 8 / 5,
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: colors.white,
    backgroundColor: colors.white,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '25%',
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  texts: {
    flex: 1,
    justifyContent: 'space-between',
    height: '75%',
    marginRight: s(10),
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(8),
  },
});

export default PlaceCard;
