import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
  StyleSheet,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import {s, vs} from 'react-native-size-matters';
import {BlurView} from '@react-native-community/blur';
import MapView, {Marker} from 'react-native-maps';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Filter from '../../components/Filter';

import {getPois} from '../../../utils/api/poiAPI';
import {Poi, Coordinate, Category, CreateModes} from '../../../utils/types';
import {
  getRegionFromPointAndDistance,
  useLoadingState,
} from '../../../utils/Misc';

import Results from './Results';
import {useBookmarkContext} from '../../../context/BookmarkContext';
import {useLocationContext} from '../../../context/LocationContext';

const SearchCategory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: CreateModes;
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
  const [places, setPlaces] = useState<Poi[]>([]);
  const [loading, withLoading] = useLoadingState();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const {bookmarks, setBookmarks} = useBookmarkContext();
  const {location, setLocation, radius} = useLocationContext();
  const [tempLocation, setTempLocation] = useState<Coordinate>(location);
  const tempLocationOff =
    Math.abs(location.latitude - tempLocation.latitude) >
      numbers.locationOffThreshold ||
    Math.abs(location.longitude - tempLocation.longitude) >
      numbers.locationOffThreshold;
  const myLocationOff =
    Math.abs(location.latitude - myLocation.latitude) >
      numbers.locationOffThreshold ||
    Math.abs(location.longitude - myLocation.longitude) >
      numbers.locationOffThreshold;

  const insets = useSafeAreaInsets();
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(2);
  const snapPoints = useMemo(
    () => [
      insets.bottom + vs(60),
      insets.bottom + s(260),
      vs(680) - (insets.top + s(50)),
    ],
    [insets],
  );

  const handleSheetChange = useCallback(
    (_: number, toIndex: number) => {
      console.log('what the fuck', toIndex);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setBottomSheetIndex(toIndex);
      if (toIndex === 0) {
        mapRef.current?.animateToRegion(
          getRegionFromPointAndDistance(location, radius),
          500,
        );
      } else if (toIndex === 1 && places[selectedIndex]) {
        mapRef.current?.animateToRegion(
          {
            latitude:
              places[selectedIndex].latitude -
              numbers.displayLongitudeDelta / 5,
            longitude: places[selectedIndex].longitude,
            latitudeDelta: numbers.displayLatitudeDelta,
            longitudeDelta: numbers.displayLongitudeDelta,
          },
          500,
        );
      }
    },
    [], // TODO: Dependency array here is weird
  );

  const filterRef = useRef<any>(null); // due to forwardRef
  const [filters, setFilters] = useState<(number | number[])[]>(
    category.filter.map(_filter => {
      return _filter.multi ? [] : _filter.defaultIdx;
    }),
  );

  useEffect(() => {
    const loadData = async (_filters: {[key: string]: string | string[]}) => {
      const data = await getPois(
        category,
        radius,
        location.latitude,
        location.longitude,
        _filters ? _filters : undefined,
      );
      if (data) {
        setPlaces(data);
      } else {
        Alert.alert(strings.error.error, strings.error.loadPlaces);
      }
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

    withLoading(() => loadData(_filters));
  }, [category, filters, location, radius]);

  return (
    <View style={STYLES.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        rotateEnabled={false}
        initialRegion={getRegionFromPointAndDistance(location, radius)}
        onRegionChangeComplete={region => {
          setTempLocation({
            latitude: region.latitude,
            longitude: region.longitude,
          });
        }}>
        {places.length > 0
          ? places.map((place: Poi, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
              />
            ))
          : null}
      </MapView>

      {Platform.OS === 'ios' ? (
        <BlurView
          blurAmount={3}
          blurType={theme === 'light' ? 'xlight' : 'dark'}
          style={[styles.blur, {height: insets.top + s(50)}]}
        />
      ) : (
        <View style={[styles.blur, styles.dim, {height: insets.top + s(50)}]} />
      )}

      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{category.name}</Text>
          <Icon
            size="m"
            icon={myLocationOff ? icons.locationFilled : icons.location}
            color={
              myLocationOff ? colors[theme].accent : colors[theme].secondary
            }
            disabled={!myLocationOff}
            onPress={() => {
              setLocation(myLocation);
              setTempLocation(myLocation);
              mapRef.current?.animateToRegion(
                getRegionFromPointAndDistance(myLocation, radius),
                500,
              );
            }}
          />
        </View>
      </SafeAreaView>

      {bottomSheetIndex === 0 && (tempLocationOff || loading) ? (
        <TouchableOpacity
          style={[
            styles.searchHere,
            {
              bottom: insets.bottom + vs(60) + vs(10),
            },
            STYLES.shadow,
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
        backgroundStyle={STYLES.container}
        index={2}
        snapPoints={snapPoints}
        onAnimate={handleSheetChange}
        animateOnMount={Platform.OS === 'ios'}
        enableContentPanningGesture={false}>
        <Filter
          ref={filterRef}
          filters={category.filter}
          currFilters={filters}
          setCurrFilters={setFilters}
        />
        {loading ? (
          <View style={STYLES.center}>
            <ActivityIndicator size="small" color={colors[theme].accent} />
          </View>
        ) : (
          <Results
            navigation={navigation}
            results={places}
            filterRef={filterRef}
            mapRef={mapRef}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
            location={location}
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
    map: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
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
      borderRadius: s(10),
      minWidth: s(100),
      backgroundColor: colors[theme].background,
    },
  });

export default SearchCategory;
