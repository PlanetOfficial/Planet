import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Animated,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLES from '../../../constants/styles';

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
  const insets = useSafeAreaInsets();

  const headerHeight = scrollPosition.interpolate({
    inputRange: [s(35), s(170)],
    outputRange: [insets.top + s(170), insets.top + s(35)],
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
              icon={icons.back}
              onPress={() => {
                StatusBar.setBarStyle('dark-content', true);
                navigation.goBack();
              }}
              color={colors.white}
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
              color={colors.white}
            />
          </View>
        </SafeAreaView>
        <Animated.View style={[styles.bottom, {opacity: bottomTitleOpacity}]}>
          <Text size="l" weight="b" color={colors.white}>
            {destination?.name}
          </Text>
          <Icon
            size="l"
            icon={icons.gallery}
            color={colors.white}
            onPress={() => setGalleryVisible(true)}
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: colors.grey,
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
    color: colors.white,
    maxWidth: s(280),
    paddingHorizontal: s(10),
  },
});

export default Header;