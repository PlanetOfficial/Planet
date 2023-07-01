import React, {useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
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

const SearchMap = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: 'create' | 'suggest' | 'add' | 'none';
      location: Coordinate;
      radius: number;
      category: Category;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';

  const [region, setRegion] = useState<Region>(
    getRegionFromPointAndDistance(route.params.location, route.params.radius),
  );

  useEffect(() => {
    setRegion(
      getRegionFromPointAndDistance(route.params.location, route.params.radius),
    );
  }, [route.params.location, route.params.radius]);

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
          </Svg>
        </View>
      </View>

      <Blur height={s(40)} />

      <View style={styles.header}>
        <Text>{strings.search.setLocation}</Text>
        <TouchableOpacity
          style={styles.done}
          onPress={() => {
            const radius = calculateRadius(
              {
                latitude: region.latitude,
                longitude: region.longitude,
              },
              region.longitudeDelta,
            );

            if (radius <= numbers.maxRadius) {
              navigation.navigate('SearchCategory', {
                category: route.params.category,
                location: {
                  latitude: region.latitude,
                  longitude: region.longitude,
                },
                radius,
                isCreate: route.params.mode,
              });
            } else {
              Alert.alert(strings.search.tooFar, strings.search.tooFarMessage);
            }
          }}>
          <Text size="s" color={colors[theme].accent}>
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
    justifyContent: 'center',
    width: s(350),
    height: s(40),

    paddingHorizontal: s(20),
  },
  done: {
    position: 'absolute',
    right: s(20),
  },
});

export default SearchMap;
