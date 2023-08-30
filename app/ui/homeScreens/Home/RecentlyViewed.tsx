import React from 'react';
import {View, StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';

import {Poi, Coordinate} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';
import {useBookmarkContext} from '../../../context/BookmarkContext';

interface Props {
  navigation: any;
  recentlyViewed: Poi[];
  location: Coordinate;
}

const RecentlyViewed: React.FC<Props> = ({
  navigation,
  recentlyViewed,
  location,
}) => {
  const theme = useColorScheme() || 'light';

  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <>
      <View style={styles.header}>
        <Text>{strings.home.recentlyViewed}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ViewHistory', {
              viewHistory: recentlyViewed,
              location: location,
            })
          }>
          <Text size="xs" color={colors[theme].accent}>
            {strings.home.seeAll} ({recentlyViewed.length})
          </Text>
        </TouchableOpacity>
      </View>
      {recentlyViewed.slice(0, 5).map((poi, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            navigation.navigate('Poi', {
              poi: poi,
              bookmarked: bookmarks.some(
                (bookmark: Poi) => bookmark.id === poi.id,
              ),
              mode: 'none',
            })
          }>
          <PoiRow
            place={poi}
            bookmarked={bookmarks.some(bookmark => bookmark.id === poi.id)}
            location={location}
            handleBookmark={(_poi: Poi) =>
              handleBookmark(_poi, bookmarks, setBookmarks)
            }
          />
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: s(5),
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
});

export default RecentlyViewed;
