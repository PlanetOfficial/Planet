import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';

import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';

import {handleBookmark} from '../../../utils/Misc';
import {Poi, Coordinate, Category, CreateModes} from '../../../utils/types';
import PoiCardXL from '../../components/PoiCardXL';
import MapView from 'react-native-maps';
import numbers from '../../../constants/numbers';

interface Props {
  navigation: any;
  results: Poi[];
  filterRef: any;
  mapRef: React.RefObject<MapView>;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  location: Coordinate;
  category: Category;
  mode: CreateModes;
  bottomSheetIndex: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const Results: React.FC<Props> = ({
  navigation,
  results: places,
  filterRef,
  mapRef,
  bookmarks,
  setBookmarks,
  location,
  category,
  mode,
  bottomSheetIndex,
  selectedIndex,
  setSelectedIndex,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  if (bottomSheetIndex === 2) {
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
                  bookmarked: bookmarks.some(
                    bookmark => bookmark.id === item.id,
                  ),
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
  } else if (bottomSheetIndex === 1) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: (s(350) - s(280)) / 2,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        scrollEventThrottle={16}
        snapToInterval={s(280) + s(20)} // 280 + 20
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        onScroll={event => {
          filterRef.current?.closeDropdown();
          let idx = Math.round(
            event.nativeEvent.contentOffset.x / (s(280) + s(20)),
          );
          if (idx !== selectedIndex) {
            setSelectedIndex(idx);
            mapRef.current?.animateToRegion(
              {
                latitude:
                  places[idx].latitude - numbers.displayLongitudeDelta / 5,
                longitude: places[idx].longitude,
                latitudeDelta: numbers.displayLatitudeDelta,
                longitudeDelta: numbers.displayLongitudeDelta,
              },
              500,
            );
          }
        }}>
        {places.map((place, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.poiCard,
              index !== places?.length - 1
                ? {
                    marginRight: s(20),
                  }
                : null,
            ]}
            onPress={() =>
              navigation.navigate('Poi', {
                poi: place,
                bookmarked: bookmarks.some(
                  bookmark => bookmark.id === place.id,
                ),
                mode: mode,
                category: category.name,
              })
            }>
            <PoiCardXL
              place={place}
              bookmarked={bookmarks.some(bookmark => bookmark.id === place.id)}
              handleBookmark={(poi: Poi) =>
                handleBookmark(poi, bookmarks, setBookmarks)
              }
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  } else {
    return <View />;
  }
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: s(10),
    overflow: 'visible',
  },
  poiCard: {
    width: s(280),
  },
});

export default Results;
