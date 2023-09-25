import React from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import BottomSheet from '@gorhom/bottom-sheet';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import numbers from '../../../constants/numbers';

import Text from '../../components/Text';

import {Poi, Coordinate} from '../../../utils/types';

interface Props {
  mapRef: React.RefObject<MapView>;
  scrollViewRef: React.RefObject<ScrollView>;
  bottomSheetRef: React.RefObject<BottomSheet>;
  bottomSheetIndex: number;
  location: Coordinate;
  setTempLocation: (location: Coordinate) => void;
  places: Poi[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const Map: React.FC<Props> = ({
  mapRef,
  scrollViewRef,
  bottomSheetRef,
  bottomSheetIndex,
  location,
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
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: numbers.defaultLatitudeDelta,
        longitudeDelta: numbers.defaultLongitudeDelta,
      }}
      onRegionChangeComplete={region => {
        setTempLocation({
          latitude: region.latitude,
          longitude: region.longitude,
        });
      }}>
      {places?.length > 0
        ? places.map((place: Poi, index: number) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
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
                <Image style={styles.icon} source={icons.pin} />
                {place.rating ? (
                  <Text size="xs" color={colors[theme].accent}>
                    {place.rating}
                  </Text>
                ) : null}
                {place.rank ? (
                  <Text size="xs" color={colors[theme].purple}>
                    {place.rank}
                  </Text>
                ) : null}
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
  icon: {
    position: 'absolute',
    width: s(40),
    height: s(40),
  },
  pin: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: s(40),
    height: s(40),
    paddingBottom: s(10),
  },
});

export default Map;
