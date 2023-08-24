import React from 'react';
import {View, StyleSheet, useColorScheme, ScrollView} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import BottomSheet from '@gorhom/bottom-sheet';

import icons from '../../../constants/icons';
import colors from '../../../constants/colors';

import Text from '../../components/Text';

import {Poi, Coordinate} from '../../../utils/types';
import {getRegionFromPointAndDistance} from '../../../utils/Misc';
import numbers from '../../../constants/numbers';

interface Props {
  mapRef: React.RefObject<MapView>;
  scrollViewRef: React.RefObject<ScrollView>;
  location: Coordinate;
  radius: number;
  bottomSheetRef: React.RefObject<BottomSheet>;
  bottomSheetIndex: number;
  setTempLocation: (location: Coordinate) => void;
  places: Poi[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const Map: React.FC<Props> = ({
  mapRef,
  scrollViewRef,
  location,
  radius,
  bottomSheetRef,
  bottomSheetIndex,
  setTempLocation,
  places,
  selectedIndex,
  setSelectedIndex,
}) => {
  const theme = useColorScheme() || 'light';

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsUserLocation={true}
      showsMyLocationButton={false}
      rotateEnabled={false}
      initialRegion={getRegionFromPointAndDistance(location, radius)}
      onPanDrag={() => {
        if (bottomSheetIndex === 1) {
          bottomSheetRef.current?.snapToIndex(0);
        }
      }}
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
              image={icons.pin}
              opacity={
                bottomSheetIndex === 1 && index !== selectedIndex ? 0.3 : 1
              }
              onPress={() => {
                bottomSheetRef.current?.snapToIndex(1);
                setSelectedIndex(index);
                scrollViewRef.current?.scrollTo({
                  x: index * s(300),
                  animated: false,
                });
                mapRef.current?.animateToRegion(
                  {
                    latitude:
                      place.latitude - numbers.displayLongitudeDelta / 5,
                    longitude: place.longitude,
                    latitudeDelta: numbers.displayLatitudeDelta,
                    longitudeDelta: numbers.displayLongitudeDelta,
                  },
                  300,
                );
              }}>
              <View style={styles.pin}>
                <Text size="xs" color={colors[theme].accent}>
                  {place.rating}
                </Text>
              </View>
            </Marker>
          ))
        : null}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 33,
  },
});

export default Map;
