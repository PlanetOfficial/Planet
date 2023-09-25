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
import MapView from 'react-native-maps';

import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import PoiRow from '../../components/PoiRow';
import PoiCardXL from '../../components/PoiCardXL';

import {Poi, Coordinate, Category, ExploreModes} from '../../../utils/types';

interface Props {
  navigation: any;
  places: Poi[];
  filterRef: any;
  mapRef: React.RefObject<MapView>;
  scrollViewRef: React.RefObject<ScrollView>;
  myLocation: Coordinate;
  category: Category;
  mode: ExploreModes;
  bottomSheetIndex: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const Results: React.FC<Props> = ({
  navigation,
  places,
  filterRef,
  mapRef,
  scrollViewRef,
  myLocation,
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
                  mode: mode,
                  category: category.name,
                })
              }>
              <PoiRow
                place={item}
                myLocation={myLocation}
                category={category}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={STYLES.center}>
            <Text weight="l">{strings.error.noResultsFound}</Text>
            <Text> </Text>
            <Text size="s" weight="l" center={true}>
              {category.is_live_category
                ? strings.error.noResultsFoundDescriptionLiveCategory
                : strings.error.noResultsFoundDescription}
            </Text>
          </View>
        }
        keyExtractor={(item: Poi) => item.id.toString()}
      />
    );
  } else if (places?.length > 0) {
    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: (s(350) - s(280)) / 2,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        scrollEventThrottle={16}
        snapToInterval={s(301)}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        onScroll={event => {
          filterRef.current?.closeDropdown();
          let idx = Math.round(event.nativeEvent.contentOffset.x / s(301));
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
              300,
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
                mode: mode,
                category: category.name,
              })
            }>
            <PoiCardXL place={place} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  } else {
    return null;
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
