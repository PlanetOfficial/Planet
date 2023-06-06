import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {s} from 'react-native-size-matters';
import MapView from 'react-native-maps';
import {Circle, Svg} from 'react-native-svg';

import colors from '../../constants/colors';

import {Region} from '../../utils/interfaces/types';
import {defaultParams} from '../../constants/numbers';
import Text from '../components/Text';
import Blur from '../components/Blur';

const SearchMap = ({navigation, route}: {navigation: any; route: any}) => {
  const [region, setRegion] = useState<Region>({
    latitude: route.params.latitude,
    longitude: route.params.longitude,
    latitudeDelta: defaultParams.defaultLatitudeDelta,
    longitudeDelta: defaultParams.defaultLongitudeDelta,
  });

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsScale={true}
          showsCompass={true}
          rotateEnabled={true}
          userInterfaceStyle={'light'}
          onRegionChangeComplete={setRegion}
        />
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

      <Blur height={s(40)} />

      <View style={styles.header}>
        <Text>Set Location</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Done</Text>
        </TouchableOpacity>
      </View>
    </>
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
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: s(350),
    height: s(40),

    paddingHorizontal: s(20),
  },
});

export default SearchMap;
