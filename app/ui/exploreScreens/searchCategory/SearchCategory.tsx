import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
  StyleSheet,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {BottomSheetHandleProps} from '@gorhom/bottom-sheet';
import {s, vs} from 'react-native-size-matters';
import {BlurView} from '@react-native-community/blur';
import MapView from 'react-native-maps';

import colors from '../../../constants/colors';
import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import {getPois} from '../../../utils/api/poiAPI';
import {isLocationOffset, getRegionFromPoints} from '../../../utils/Misc';
import {Poi, Coordinate, Category, ExploreModes} from '../../../utils/types';

import {useBookmarkContext} from '../../../context/BookmarkContext';
import {useLocationContext} from '../../../context/LocationContext';

import Map from './Map';
import Header from './Header';
import Filters from './Filters';
import Results from './Results';
import Handle from './Handle';

const SearchCategory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: ExploreModes;
      myLocation: Coordinate;
      category: Category;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      StatusBar.setBarStyle(colors[theme].statusBar, true);
    });

    return unsubscribe;
  }, [navigation, theme]);

  const {mode, myLocation, category} = route.params;

  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [places, setPlaces] = useState<Poi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const {bookmarks} = useBookmarkContext();

  const {location, setLocation} = useLocationContext();
  const [tempLocation, setTempLocation] = useState<Coordinate>(location);
  const isTempLocationOffset = isLocationOffset(tempLocation, location);
  const isMyLocationOffset = isLocationOffset(myLocation, location);

  const filterRef = useRef<any>(null); // due to forwardRef
  const [filters, setFilters] = useState<(number | number[])[]>(
    category.filter.map(_filter => {
      return _filter.multi ? [] : _filter.defaultIdx;
    }),
  );

  const insets = useSafeAreaInsets();
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(2);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [
      insets.bottom + s(30),
      insets.bottom + (filters.length > 0 ? s(285) : s(235)),
      vs(680) - (insets.top + s(50)),
    ],
    [insets, filters],
  );

  const handleSheetChange = useCallback(
    async (fromIndex: number, toIndex: number) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setBottomSheetIndex(toIndex);
      filterRef.current?.closeDropdown();
      if (toIndex === 0 && places?.length > 0) {
        mapRef.current?.animateToRegion(getRegionFromPoints(places), 300);
      } else if (fromIndex === 2 && toIndex === 1) {
        if (places?.length > 0) {
          mapRef.current?.animateToRegion(
            {
              latitude: places[0].latitude - numbers.displayLongitudeDelta / 5,
              longitude: places[0].longitude,
              latitudeDelta: numbers.displayLatitudeDelta,
              longitudeDelta: numbers.displayLongitudeDelta,
            },
            300,
          );
        } else {
          bottomSheetRef.current?.snapToIndex(2 - fromIndex);
        }
        setSelectedIndex(0);
      }
    },
    [places],
  );

  const HandleComponent = useCallback(
    (props: BottomSheetHandleProps) => (
      <Handle
        {...props}
        onHandlePress={() => {
          if (loading) {
            return;
          }
          if (bottomSheetIndex === 0) {
            setBottomSheetIndex(2);
            bottomSheetRef.current?.snapToIndex(2);
          } else if (bottomSheetIndex === 2) {
            setBottomSheetIndex(1);
            bottomSheetRef.current?.snapToIndex(1);
          }
        }}
      />
    ),
    [loading, bottomSheetIndex],
  );

  useEffect(() => {
    const loadData = async (_filters: {[key: string]: string | string[]}) => {
      const data = await getPois(
        category,
        location.latitude,
        location.longitude,
        _filters ? _filters : undefined,
      );
      if (data) {
        setPlaces(data);
        bottomSheetRef.current?.snapToIndex(2);
        if (data.length > 0) {
          mapRef.current?.animateToRegion(getRegionFromPoints(data), 300);
        } else {
          mapRef.current?.animateToRegion(
            {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: numbers.defaultLatitudeDelta,
              longitudeDelta: numbers.defaultLongitudeDelta,
            },
            300,
          );
        }
      } else {
        Alert.alert(strings.error.error, strings.error.loadPlaces);
      }
      setLoading(false);
    };

    const _filters: {[key: string]: string | string[]} = {};
    for (let i = 0; i < category.filter.length; i++) {
      const filter = category.filter[i];
      const _filter = filters[i];
      if (Array.isArray(_filter)) {
        const filterValues: string[] = [];
        for (let j = 0; j < _filter.length; j++) {
          filterValues.push(filter.options[_filter[j]]);
        }
        _filters[filter.name] = filterValues;
      } else {
        _filters[filter.name] =
          filters[i] === -1 ? '' : filter.options[filters[i] as number];
      }
    }

    setLoading(true);
    loadData(_filters);
  }, [category, filters, location]);

  return (
    <View style={STYLES.container}>
      <Map
        mapRef={mapRef}
        scrollViewRef={scrollViewRef}
        bottomSheetRef={bottomSheetRef}
        bottomSheetIndex={bottomSheetIndex}
        location={location}
        setTempLocation={setTempLocation}
        places={places}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      {Platform.OS === 'ios' ? (
        <BlurView
          blurAmount={3}
          blurType={theme === 'light' ? 'xlight' : 'dark'}
          style={[styles.blur, {height: insets.top + s(50)}]}
        />
      ) : (
        <View style={[styles.blur, styles.dim, {height: insets.top + s(50)}]} />
      )}

      <Header
        navigation={navigation}
        category={category}
        isMyLocationOffset={isMyLocationOffset}
        myLocation={myLocation}
      />

      {bottomSheetIndex === 0 && (isTempLocationOffset || loading) ? (
        <TouchableOpacity
          style={[
            styles.searchHere,
            {
              bottom: insets.bottom + vs(30),
            },
          ]}
          disabled={loading}
          onPress={() => setLocation(tempLocation)}>
          {loading ? (
            <ActivityIndicator size="small" color={colors[theme].accent} />
          ) : (
            <Text size="s">{strings.explore.searchHere}</Text>
          )}
        </TouchableOpacity>
      ) : null}

      <BottomSheet
        ref={bottomSheetRef}
        backgroundStyle={[
          STYLES.container,
          bottomSheetIndex === 0 ? styles.transparent : null,
        ]}
        handleComponent={HandleComponent}
        index={2}
        snapPoints={snapPoints}
        onAnimate={handleSheetChange}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={!loading && bottomSheetIndex !== 0}>
        {bottomSheetIndex === 0 ? (
          <View style={{height: s(50)}} />
        ) : filters.length > 0 ? (
          <Filters
            ref={filterRef}
            filters={category.filter}
            currFilters={filters}
            setCurrFilters={setFilters}
          />
        ) : null}
        {loading ? (
          <View style={STYLES.center}>
            <ActivityIndicator size="small" color={colors[theme].accent} />
          </View>
        ) : (
          <Results
            navigation={navigation}
            places={places}
            filterRef={filterRef}
            mapRef={mapRef}
            scrollViewRef={scrollViewRef}
            bookmarks={bookmarks}
            myLocation={myLocation}
            category={category}
            mode={mode}
            bottomSheetIndex={bottomSheetIndex}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        )}
      </BottomSheet>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    blur: {
      position: 'absolute',
      width: '100%',
    },
    dim: {
      backgroundColor: colors[theme].blur,
    },
    searchHere: {
      alignSelf: 'center',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      padding: s(10),
      borderRadius: s(5),
      minWidth: s(100),
      backgroundColor: colors[theme].blur,
    },
    transparent: {
      opacity: 0.8,
    },
  });

export default SearchCategory;
