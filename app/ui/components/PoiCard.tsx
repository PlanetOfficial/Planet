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
  place: Poi;
  disabled?: boolean;
  bookmarked: boolean;
  handleBookmark: (poi: Poi) => void;
}

const PoiCard: React.FC<Props> = ({
  place,
  disabled,
  bookmarked,
  handleBookmark,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  return (
    <View style={[styles.container, STYLES.shadow]}>
      <Image
        style={styles.image}
        source={place.photo ? {uri: place.photo} : icons.placeholder}
      />
      <View style={styles.footer}>
        <View style={styles.infoContainer}>
          <Text size="xs" numberOfLines={1}>
            {place.name}
          </Text>
          <Text size="xs" numberOfLines={1}>
            {getInfoString(place)}
          </Text>
        </View>
        <Icon
          size="m"
          disabled={disabled}
          icon={bookmarked ? icons.bookmarked : icons.bookmark}
          color={bookmarked ? colors[theme].accent : colors[theme].neutral}
          onPress={() => handleBookmark(place)}
        />
      </View>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      width: s(130),
      height: s(160),
      borderRadius: s(5),
      backgroundColor: colors[theme].primary,
      overflow: 'visible',
    },
    image: {
      width: '100%',
      height: s(120),
      borderTopLeftRadius: s(5),
      borderTopRightRadius: s(5),
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
  });

export default PoiCard;
