import React from 'react';
import {Image, StyleSheet, View, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import STYLING from '../../constants/styles';

import Icon from './Icon';
import Text from './Text';

import {Poi} from '../../utils/types';
import {getInfoString} from '../../utils/Misc';

interface Props {
  poi: Poi;
  disabled?: boolean;
  bookmarked: boolean;
  handleBookmark: (poi: Poi) => void;
  index?: number;
}

const PoiCard: React.FC<Props> = ({
  poi,
  disabled,
  bookmarked,
  handleBookmark,
  index,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  return (
    <View style={[styles.container, STYLES.shadow]}>
      <Image
        style={styles.image}
        source={poi.photo ? {uri: poi.photo} : icons.placeholder}
      />
      <View style={styles.footer}>
        <View style={styles.infoContainer}>
          <Text size="xs" numberOfLines={1}>
            {poi.name}
          </Text>
          <Text size="xs" numberOfLines={1}>
            {getInfoString(poi)}
          </Text>
        </View>
        <Icon
          size="m"
          disabled={disabled}
          icon={bookmarked ? icons.bookmarked : icons.bookmark}
          color={bookmarked ? colors[theme].accent : colors[theme].neutral}
          onPress={() => handleBookmark(poi)}
        />
      </View>
      {index ? (
        <View style={[STYLES.absolute, styles.indexContainer]}>
          <Text size="s" color={colors[theme].accent}>
            {index}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      width: s(130),
      height: s(160),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
      overflow: 'visible',
    },
    image: {
      width: '100%',
      height: s(120),
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
      justifyContent: 'space-evenly',
      height: s(40),
      paddingVertical: s(4),
    },
    indexContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      top: s(-8),
      left: s(-8),
      width: s(20),
      height: s(20),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
  });

export default PoiCard;
