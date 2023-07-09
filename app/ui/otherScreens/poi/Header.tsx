import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Animated,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {Poi} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';

interface Props {
  navigation: any;
  scrollPosition: Animated.Value;
  destination: Poi | undefined;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  setGalleryVisible: (galleryVisible: boolean) => void;
}

const Header: React.FC<Props> = ({
  navigation,
  scrollPosition,
  destination,
  bookmarks,
  setBookmarks,
  setGalleryVisible,
}) => {
  const theme = 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const insets = useSafeAreaInsets();

  const headerHeight = scrollPosition.interpolate({
    inputRange: [s(35), s(170)],
    outputRange: [insets.top + s(170), insets.top + s(50)],
    extrapolate: 'clamp',
  });
  const topTitleOpacity = scrollPosition.interpolate({
    inputRange: [s(100), s(180)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const bottomTitleOpacity = scrollPosition.interpolate({
    inputRange: [s(80), s(120)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{height: headerHeight}}>
      {destination?.photo ? (
        <ImageBackground
          style={styles.image}
          source={{uri: destination?.photo}}>
          <View style={STYLES.dim} />
        </ImageBackground>
      ) : (
        <View style={styles.image} />
      )}
      <Animated.View style={[styles.container, {height: headerHeight}]}>
        <SafeAreaView>
          <View style={styles.row}>
            <Icon
              size="m"
              icon={icons.back}
              onPress={() => navigation.goBack()}
              color={colors[theme].primary}
            />
            <Animated.Text
              style={[styles.title, {opacity: topTitleOpacity}]}
              numberOfLines={1}>
              {destination?.name}
            </Animated.Text>
            <Icon
              size="m"
              icon={
                bookmarks.some(bookmark => bookmark.id === destination?.id)
                  ? icons.bookmarked
                  : icons.bookmark
              }
              onPress={() =>
                destination
                  ? handleBookmark(destination, bookmarks, setBookmarks)
                  : null
              }
              color={colors[theme].primary}
            />
          </View>
        </SafeAreaView>
        <Animated.View style={[styles.bottom, {opacity: bottomTitleOpacity}]}>
          <View style={styles.mainTitle}>
            <Text size="l" weight="b" color={colors[theme].primary}>
              {destination?.name}
            </Text>
          </View>
          {destination?.photo && destination?.photo.length > 1 ? (
            <Icon
              size="l"
              icon={icons.gallery}
              color={colors[theme].primary}
              onPress={() => setGalleryVisible(true)}
            />
          ) : null}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: colors[theme].neutral,
    },
    container: {
      width: '100%',
      justifyContent: 'space-between',
      paddingHorizontal: s(20),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'visible',
      marginVertical: s(15),
    },
    bottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: s(5),
      marginBottom: s(15),
    },
    title: {
      fontSize: s(16),
      fontWeight: '700',
      fontFamily: 'Lato',
      color: colors[theme].primary,
      maxWidth: s(280),
      paddingHorizontal: s(10),
    },
    mainTitle: {
      paddingRight: s(10),
      maxWidth: s(280),
    },
  });

export default Header;
