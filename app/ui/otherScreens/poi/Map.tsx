import React from 'react';
import {StyleSheet, LayoutAnimation} from 'react-native';
import {s} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';

import numbers from '../../../constants/numbers';

interface Props {
  latitude: number;
  longitude: number;
}

const Map: React.FC<Props> = ({latitude, longitude}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <MapView
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
      }}
      style={[styles.map, {height: expanded ? s(360) : s(180)}]}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: numbers.defaultLatitudeDelta,
        longitudeDelta: numbers.defaultLongitudeDelta,
      }}>
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
  },
});

export default Map;
