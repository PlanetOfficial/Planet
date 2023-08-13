import React from 'react';
import {View, FlatList, TouchableOpacity, useColorScheme} from 'react-native';

import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

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
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return (
    <FlatList
      data={places}
      scrollIndicatorInsets={{right: 1}}
      onTouchStart={() => filterRef.current?.closeDropdown()}
      renderItem={({item}: {item: Poi}) => {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Poi', {
                poi: item,
                bookmarked: bookmarks.some(bookmark => bookmark.id === item.id),
                mode: mode,
                category: category.name,
              })
            }>
            <PoiRow
              place={item}
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
          <Text weight="l">{strings.search.noResultsFound}</Text>
          <Text> </Text>
          <Text size="s" weight="l">
            {strings.search.noResultsFoundDescription}
          </Text>
        </View>
      }
      keyExtractor={(item: Poi) => item.id.toString()}
    />
  );
};

export default Results;
