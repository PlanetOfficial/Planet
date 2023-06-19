import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Icon from './Icon';
import Text from './Text';

import {Poi} from '../../utils/types';
import {getInfoString} from '../../utils/Misc';

interface Props {
  poi: Poi;
  disabled?: boolean;
  bookmarked: boolean;
  handleBookmark: (poi: Poi) => void;
}

const PoiCard: React.FC<Props> = ({
  poi,
  disabled,
  bookmarked,
  handleBookmark,
}) => {
  return (
    <View style={[cardStyles.container, styles.shadow]}>
      <Image
        style={cardStyles.image}
        source={poi.photo ? {uri: poi.photo} : icons.placeholder}
      />
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
          disabled={disabled}
          icon={bookmarked ? icons.bookmarked : icons.bookmark}
          color={bookmarked ? colors.accent : colors.black}
          onPress={() => handleBookmark(poi)}
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
