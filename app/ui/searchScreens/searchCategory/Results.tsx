import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';

import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';

import {handleBookmark} from '../../../utils/Misc';
import {Poi, Coordinate, Category} from '../../../utils/types';

interface Props {
  navigation: any;
  results: Poi[];
  filterRef: any;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  location: Coordinate;
  category: Category;
  mode: 'create' | 'suggest' | 'add' | 'none';
}

const Results: React.FC<Props> = ({
  navigation,
  results: places,
  filterRef,
  bookmarks,
  setBookmarks,
  location,
  category,
  mode,
}) => {
  return (
    <FlatList
      data={places}
      onTouchStart={() => filterRef.current?.closeDropdown()}
      renderItem={({item}: {item: Poi}) => {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Poi', {
                poi: item,
                bookmarked: bookmarks.some(bookmark => bookmark.id === item.id),
                mode: mode,
              })
            }>
            <PoiRow
              poi={item}
              bookmarked={bookmarks.some(bookmark => bookmark.id === item.id)}
              handleBookmark={(poi: Poi) =>
                handleBookmark(poi, bookmarks, setBookmarks)
              }
              location={location}
              category={category}
            />
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <View style={STYLES.center}>
          <Text>{strings.search.noResultsFound}</Text>
          <Text> </Text>
          <Text size="s">{strings.search.noResultsFoundDescription}</Text>
        </View>
      }
      keyExtractor={(item: Poi) => item.id.toString()}
    />
  );
};

export default Results;
