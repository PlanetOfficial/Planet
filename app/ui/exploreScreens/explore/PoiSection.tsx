import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {s} from 'react-native-size-matters';

import Text from '../../components/Text';
import PoiCard from '../../components/PoiCard';
import Separator from '../../components/SeparatorR';

import {ExploreModes, Poi} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';

import {useBookmarkContext} from '../../../context/BookmarkContext';

interface Props {
  navigation: any;
  title: string;
  pois: Poi[];
  mode: ExploreModes
}

const PoiSection: React.FC<Props> = ({navigation, title, pois, mode}) => {
  const {bookmarks, setBookmarks} = useBookmarkContext();

  return (
    <>
      <View style={styles.header}>
        <Text size="s">{title}</Text>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        {pois.map((poi, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate('Poi', {
                poi: poi,
                bookmarked: bookmarks.some(
                  (bookmark: Poi) => bookmark.id === poi.id,
                ),
                mode: mode,
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
      <Separator />
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
    paddingVertical: s(5),
  },
  card: {
    marginRight: s(15),
  },
  scrollView: {
    paddingHorizontal: s(20),
    paddingVertical: s(5),
    marginBottom: s(15),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  next: {
    marginLeft: s(3),
  },
});

export default PoiSection;
