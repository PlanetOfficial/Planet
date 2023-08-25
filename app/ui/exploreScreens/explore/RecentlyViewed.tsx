import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {s} from 'react-native-size-matters';

import strings from '../../../constants/strings';

import Text from '../../components/Text';
import PoiCard from '../../components/PoiCard';

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
  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <>
      <View style={styles.header}>
        <Text size="s">{strings.explore.recentlyViewed}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ViewHistory', {
              viewHistory: recentlyViewed,
              location: location,
            })
          }>
          <Text size="xs" weight="l" underline={true}>
            {strings.explore.viewAll}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        {recentlyViewed.slice(0, 5).map((poi, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate('Poi', {
                poi: poi,
                bookmarked: bookmarks.some(
                  (bookmark: Poi) => bookmark.id === poi.id,
                ),
                mode: 'none',
              })
            }>
            <PoiCard
              place={poi}
              bookmarked={bookmarks.some(bookmark => bookmark.id === poi.id)}
              handleBookmark={(_poi: Poi) =>
                handleBookmark(_poi, bookmarks, setBookmarks)
              }
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  card: {
    marginRight: s(15),
  },
  scrollView: {
    paddingHorizontal: s(20),
    paddingVertical: s(5),
  },
});

export default RecentlyViewed;
