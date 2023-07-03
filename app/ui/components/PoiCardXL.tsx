import React from 'react';
import {StyleSheet, View, Animated, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import STYLING from '../../constants/styles';

import Icon from './Icon';
import Text from './Text';
import OptionMenu from './OptionMenu';

import {Option, Poi} from '../../utils/types';
import {getInfoString} from '../../utils/Misc';

interface Props {
  poi: Poi;
  disabled?: boolean;
  width?: Animated.AnimatedInterpolation<string | number> | number;
  bookmarked?: boolean;
  handleBookmark?: (poi: Poi) => void;
  options?: Option[];
  voted?: boolean;
  onVote?: () => void;
}

const PoiCardXL: React.FC<Props> = ({
  poi,
  disabled = false,
  width,
  bookmarked,
  handleBookmark,
  options,
  voted,
  onVote,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  return (
    <Animated.View style={[styles.container, STYLES.shadow, {width: width}]}>
      <FastImage
        style={styles.image}
        source={poi.photo ? {uri: poi.photo} : icons.placeholder}
      />
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1}>{poi.name}</Text>
          <Text size="xs" color={colors[theme].accent} numberOfLines={1}>
            {getInfoString(poi)}
          </Text>
        </View>
        {handleBookmark ? (
          <Icon
            size="m"
            disabled={disabled}
            icon={bookmarked ? icons.bookmarked : icons.bookmark}
            color={bookmarked ? colors[theme].accent : colors[theme].neutral}
            onPress={() => handleBookmark(poi)}
          />
        ) : options ? (
          <OptionMenu options={options} />
        ) : null}
      </View>
      {onVote ? (
        <View style={styles.voteButton}>
          <Icon
            size="m"
            disabled={disabled}
            icon={icons.like}
            color={voted ? colors[theme].accent : colors[theme].secondary}
            onPress={onVote}
          />
        </View>
      ) : null}
    </Animated.View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      aspectRatio: 1.6,
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
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
      backgroundColor: colors[theme].blur,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'space-between',
      height: s(40),
      paddingVertical: s(2),
    },
    voteButton: {
      position: 'absolute',
      bottom: s(10),
      right: s(10),
      width: s(40),
      height: s(40),
      borderRadius: s(20),
      backgroundColor: colors[theme].primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default PoiCardXL;
