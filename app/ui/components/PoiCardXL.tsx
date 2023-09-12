import React from 'react';
import {StyleSheet, View, Animated, useColorScheme, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import STYLING from '../../constants/styles';

import Icon from './Icon';
import Text from './Text';
import OptionMenu from './OptionMenu';

import {Option, Poi} from '../../utils/types';
import {getInfoString, handleBookmark, useLoadingState} from '../../utils/Misc';

import {useBookmarkContext} from '../../context/BookmarkContext';

interface Props {
  place: Poi;
  disabled?: boolean;
  width?: Animated.AnimatedInterpolation<string | number> | number;
  noBookmark?: boolean;
  bookmarked?: boolean;
  options?: Option[];
  voted?: boolean;
  onVote?: () => void;
}

const PoiCardXL: React.FC<Props> = ({
  place,
  disabled = false,
  width,
  noBookmark = false,
  bookmarked,
  options,
  voted,
  onVote,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const {bookmarks, setBookmarks} = useBookmarkContext();
  const [loading, withLoading] = useLoadingState();

  return (
    <Animated.View style={[styles.container, STYLES.shadow, {width: width}]}>
      <Image
        style={styles.image}
        source={place.photo ? {uri: place.photo} : icons.placeholder}
      />
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1}>{place.name}</Text>
          <Text size="xs" color={colors[theme].accent} numberOfLines={1}>
            {getInfoString(place)}
          </Text>
        </View>
        {!noBookmark ? (
          <Icon
            size="m"
            disabled={disabled}
            icon={bookmarked ? icons.bookmarked : icons.bookmark}
            color={bookmarked ? colors[theme].accent : colors[theme].neutral}
            onPress={() =>
              withLoading(() => handleBookmark(place, bookmarks, setBookmarks))
            }
          />
        ) : options ? (
          <OptionMenu options={options} />
        ) : null}
      </View>
      {onVote ? (
        <View style={styles.voteButton}>
          <Icon
            size="m"
            disabled={disabled || loading}
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
      borderRadius: s(5),
      backgroundColor: colors[theme].primary,
    },
    image: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: s(5),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: s(15),
      borderTopLeftRadius: s(5),
      borderTopRightRadius: s(5),
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
