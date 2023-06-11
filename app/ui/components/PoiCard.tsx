import React from 'react';
import {StyleSheet, View, Image, Alert} from 'react-native';

import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Icon from './Icon';
import Text from './Text';

import {Poi} from '../../utils/types';
import {bookmark} from '../../utils/api/bookmarkAPI';
import { getInfoString } from '../../utils/Misc';

interface Props {
  poi: Poi;
  bookmarked: boolean;
}

const PoiCard: React.FC<Props> = ({poi, bookmarked}) => {
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

  return (
    <View style={[cardStyles.container, styles.shadow]}>
      <Image style={cardStyles.image} source={{uri: poi.photo}} />
      <View style={cardStyles.footer}>
        <View style={cardStyles.infoContainer}>
          <Text size="s" numberOfLines={1}>
            {poi.name}
          </Text>
          <Text size="xs" color={colors.darkgrey} numberOfLines={1}>
            {getInfoString(poi)}
          </Text>
        </View>
        <Icon
          size="m"
          icon={bookmarked ? icons.bookmarked : icons.bookmark}
          color={bookmarked ? colors.accent : colors.black}
          onPress={handleBookmark}
        />
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    width: s(140),
    height: s(180),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  image: {
    width: '100%',
    height: s(140),
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(7),
    height: s(40),
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: s(40),
    paddingVertical: s(4),
  },
});

export default PoiCard;
