import React, {useState} from 'react';
import {StyleSheet, LayoutAnimation, View} from 'react-native';
import {s} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';

import numbers from '../../../constants/numbers';
import Icon from '../../components/Icon';
import icons from '../../../constants/icons';

interface Props {
  latitude: number;
  longitude: number;
}

const Map: React.FC<Props> = ({latitude, longitude}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <MapView
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
      <View style={styles.button}>
        <Icon
          icon={expanded ? icons.shrink : icons.expand}
          button={true}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setExpanded(!expanded);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: s(5),
    right: s(5),
  },
});

export default Map;
