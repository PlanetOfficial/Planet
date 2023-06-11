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
import {getInfoString} from '../../utils/Misc';

interface Props {
  poi: Poi;
  bookmarked: boolean;
}

const PoiCardXL: React.FC<Props> = ({poi, bookmarked}) => {
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
      <View style={cardStyles.header}>
        <View style={cardStyles.infoContainer}>
          <Text numberOfLines={1}>{poi.name}</Text>
          <Text size="xs" color={colors.accent} numberOfLines={1}>
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
    width: s(310),
    height: s(200),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(10),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(15),
    width: '100%',
    height: s(45),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: s(40),
    paddingVertical: s(2),
  },
});

export default PoiCardXL;
