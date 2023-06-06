import React, {useState} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {s} from 'react-native-size-matters';
import MapView from 'react-native-maps';
import {Circle, Svg} from 'react-native-svg';

import colors from '../../constants/colors';
import {defaultParams} from '../../constants/numbers';

import {Region} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  route: any;
}

const SearchMap: React.FC<Props> = ({navigation, route}) => {
  const [region, setRegion] = useState<Region>({
    latitude: defaultParams.defaultLatitude,
    longitude: defaultParams.defaultLongitude,
    latitudeDelta: defaultParams.defaultLatitudeDelta,
    longitudeDelta: defaultParams.defaultLongitudeDelta,
  });

  return (
    <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsScale={true}
          showsCompass={true}
          rotateEnabled={false}
          showsMyLocationButton={true}
          userInterfaceStyle={'light'}
          onRegionChangeComplete={setRegion}
          region={region}/>
        <View pointerEvents={'none'} style={styles.circle}>
          <Svg style={styles.circle}>
            <Circle
              cx={s(150)}
              cy={s(150)}
              r={s(148)}
              stroke={colors.white}
              strokeWidth={4}
              fill={colors.accent}
              fillOpacity={0.3}
            />
          </Svg>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    width: s(300),
    height: s(300),
  },
});

export default SearchMap;
