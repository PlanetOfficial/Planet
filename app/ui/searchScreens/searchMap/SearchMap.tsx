import React, {useEffect, useState, useContext} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s} from 'react-native-size-matters';
import MapView from 'react-native-maps';
import {Circle, Svg} from 'react-native-svg';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import numbers from '../../../constants/numbers';

import Text from '../../components/Text';

import {
  calculateRadius,
  getRegionFromPointAndDistance,
} from '../../../utils/Misc';
import {Category, Coordinate, Region} from '../../../utils/types';

import Blur from './Blur';
import { useLocationContext } from '../../../context/LocationState';

const SearchMap = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: 'create' | 'suggest' | 'add' | 'none';
      myLocation: Coordinate;
      category: Category;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {mode, myLocation, category} = route.params;

  const {location, setLocation, radius, setRadius} = useLocationContext();

  const [region, setRegion] = useState<Region>(
    getRegionFromPointAndDistance(location, radius),
  );

  useEffect(() => {
    setRegion(getRegionFromPointAndDistance(location, radius));
  }, [location, radius]);

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
          region={region}
          onRegionChangeComplete={setRegion}
          mapPadding={{
            top: s(40),
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
        <View pointerEvents={'none'} style={styles.circle}>
          <Svg style={styles.circle}>
            <Circle
              cx={s(150)}
              cy={s(150)}
              r={s(148)}
              stroke={colors.light.primary}
              strokeWidth={4}
              fill={colors[theme].accent}
              fillOpacity={0.3}
            />
            <Circle
              cx={s(150)}
              cy={s(150)}
              r={s(3)}
              fill={colors[theme].accent}
            />
          </Svg>
        </View>
      </View>

      <Blur height={s(40)} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setRegion(
              getRegionFromPointAndDistance(myLocation, numbers.defaultRadius),
            );
          }}>
          <Text
            size="s"
            color={
              region.latitude.toFixed(2) === myLocation.latitude.toFixed(2) &&
              region.longitude.toFixed(2) === myLocation.longitude.toFixed(2)
                ? colors[theme].secondary
                : colors[theme].neutral
            }>
            {strings.main.reset}
          </Text>
        </TouchableOpacity>
        <Text>{strings.search.setLocation}</Text>
        <TouchableOpacity
          onPress={() => {
            const _radius = calculateRadius(
              {
                latitude: region.latitude,
                longitude: region.longitude,
              },
              region.longitudeDelta,
            );

            if (_radius <= numbers.maxRadius) {
              setLocation({
                latitude: region.latitude,
                longitude: region.longitude,
              });
              setRadius(_radius);
              navigation.navigate('SearchCategory', {
                category: category,
                myLocation: myLocation,
                mode: mode,
              });
            } else {
              Alert.alert(strings.search.tooFar, strings.search.tooFarMessage);
            }
          }}>
          <Text
            size="s"
            color={
              calculateRadius(
                {
                  latitude: region.latitude,
                  longitude: region.longitude,
                },
                region.longitudeDelta,
              ) <= numbers.maxRadius
                ? colors[theme].accent
                : colors[theme].secondary
            }>
            {strings.main.done}
          </Text>
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
    justifyContent: 'space-between',
    width: s(350),
    height: s(40),
    paddingHorizontal: s(20),
  },
});

export default SearchMap;
