import React from 'react';
import {StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView, {Marker} from 'react-native-maps';

import {Poi, Coordinate} from '../../../utils/types';
import {getRegionFromPointAndDistance} from '../../../utils/Misc';

interface Props {
  mapRef: React.RefObject<MapView>;
  location: Coordinate;
  radius: number;
  bottomSheetRef: React.RefObject<BottomSheet>;
  bottomSheetIndex: number;
  setTempLocation: (location: Coordinate) => void;
  places: Poi[];
}

const Map: React.FC<Props> = ({
  mapRef,
  location,
  radius,
  bottomSheetRef,
  bottomSheetIndex,
  setTempLocation,
  places,
}) => {
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
            />
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
});

export default Map;
