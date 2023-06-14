import React from 'react';
import {StyleSheet, View, Image, Animated} from 'react-native';

import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Icon from './Icon';
import Text from './Text';

import {Option, Poi} from '../../utils/types';
import {getInfoString} from '../../utils/Misc';
import OptionMenu from './OptionMenu';

interface Props {
  poi: Poi;
  width?: Animated.AnimatedInterpolation<string | number>;
  bookmarked?: boolean;
  handleBookmark?: (poi: Poi) => void;
  options?: Option[];
}

const PoiCardXL: React.FC<Props> = ({
  poi,
  width,
  bookmarked,
  handleBookmark,
  options,
}) => {
  return (
    <Animated.View
      style={[cardStyles.container, styles.shadow, {width: width}]}>
      <Image style={cardStyles.image} source={{uri: poi.photo}} />
      <View style={cardStyles.header}>
        <View style={cardStyles.infoContainer}>
          <Text numberOfLines={1}>{poi.name}</Text>
          <Text size="xs" color={colors.accent} numberOfLines={1}>
            {getInfoString(poi)}
          </Text>
        </View>
        {bookmarked && handleBookmark ? (
          <Icon
            size="m"
            icon={bookmarked ? icons.bookmarked : icons.bookmark}
            color={bookmarked ? colors.accent : colors.black}
            onPress={() => handleBookmark(poi)}
          />
        ) : options ? (
          <OptionMenu options={options} />
        ) : null}
      </View>
    </Animated.View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    aspectRatio: 1.6,
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
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
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
