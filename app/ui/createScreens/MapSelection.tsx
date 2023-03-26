import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  
} from 'react-native';
import {s} from 'react-native-size-matters';
import MapView from 'react-native-maps';
import {Svg, Circle} from 'react-native-svg';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Geolocation from '@react-native-community/geolocation';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {integers, floats} from '../../constants/numbers';
import {colors} from '../../constants/theme';
import {calculateRadius} from '../../utils/functions/Misc';

import {GoogleMapsAPIKey} from '../../utils/api/APIConstants';

const MapScreen = ({navigation}: {navigation: any}) => {
  const [region, setRegion] = useState({
    latitude: floats.defaultLatitude,
    longitude: floats.defaultLongitude,
    latitudeDelta: floats.defaultLatitudeDelta,
    longitudeDelta: floats.defaultLongitudeDelta,
  });

  const [radius, setRadius] = useState(
    calculateRadius(
      {latitude: floats.defaultLatitude, longitude: floats.defaultLongitude},
      floats.defaultLongitudeDelta,
    ),
  );

  const updateRadius = (reg: any) => {
    setRadius(
      calculateRadius(
        {latitude: reg.latitude, longitude: reg.longitude},
        reg.longitudeDelta,
      ),
    );
  };

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const setCurrentLocation = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      } else if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted.');
          } else {
            console.log('Location permission denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const newRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: floats.defaultLatitudeDelta,
            longitudeDelta: floats.defaultLongitudeDelta,
          };
          setRegion(newRegion);
        },
        (error: any) => {
          console.log(error);
        },
      );
    };

    setCurrentLocation();
  }, []);

  return (
    <>
      <View style={mapStyles.container}>
        <MapView
          style={mapStyles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsScale={false}
          showsCompass={false}
          rotateEnabled={false}
          onRegionChange={updateRadius}
          onRegionChangeComplete={setRegion}
          region={region}
        />
        <View pointerEvents={'none'} style={mapStyles.circle}>
          <Svg style={mapStyles.circle}>
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
        <View style={mapStyles.rIndContainer}>
          <View style={mapStyles.rIndBackground}/>
          <Text style={[mapStyles.radiusIndicator, {color: colors.black}]}>
            {strings.createTabStack.radius}
            {': '}
            <Text
              style={mapStyles.radius
              }>
              {(radius / integers.milesToMeters).toFixed(1)}
            </Text>{' '}
            {strings.createTabStack.milesAbbrev}
          </Text>
        </View>
      </View>

      <View style={[styles.top, {height: insets.top + s(54.5)}]}/>
      <SafeAreaView style={styles.container}>
        <View style={headerStyles.container}>
          <TouchableOpacity
            style={headerStyles.x}
            onPress={() => navigation.navigate('TabStack')}>
            <Image style={headerStyles.icon} source={icons.x} />
          </TouchableOpacity>
          <Text style={headerStyles.title}>
            {strings.createTabStack.planEvent}
          </Text>
          <TouchableOpacity
            style={headerStyles.next}
            disabled={radius > integers.maxRadiusInMeters}
            onPress={() => {
              navigation.navigate('SelectCategories', {
                latitude: region.latitude,
                longitude: region.longitude,
                radius: radius,
              });
            }}>
            <Image
              style={
                radius <= integers.maxRadiusInMeters
                  ? headerStyles.icon
                  : headerStyles.disabledIcon
              }
              source={icons.back}
            />
          </TouchableOpacity>
        </View>
        <View>
          <GooglePlacesAutocomplete
            placeholder={strings.createTabStack.search}
            onPress={(data, details = null) => {
              if (
                details?.geometry?.location?.lat &&
                details?.geometry?.location?.lng
              ) {
                setRegion({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: floats.defaultLatitudeDelta,
                  longitudeDelta: floats.defaultLongitudeDelta,
                });
              }
            }}
            query={{
              // TODO: Use ENV obviously
              key: GoogleMapsAPIKey,
              language: 'en',
            }}
            enablePoweredByContainer={false}
            fetchDetails={true}
            styles={{
              container: searchStyles.container,
              textInput: searchStyles.textInput,
              row: searchStyles.row,
              separator: searchStyles.separator,
            }}
          />
          <Image style={searchStyles.icon} source={icons.search} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  top: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: colors.white,
    opacity: 0.85,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,

  },
  x: {
    width: s(20),
    height: s(20),
  },
  next: {
    width: s(40/3),
    height: s(20),
    transform: [{rotate: '180deg'}],
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  disabledIcon: {
    width: '100%',
    height: '100%',
    tintColor: colors.darkgrey,
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flex: 0,
    width: s(310),
    backgroundColor: colors.white,
    borderRadius: s(10),
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  textInput: {
    paddingVertical: 0,
    marginLeft: s(20),
    paddingLeft: s(10),
    marginBottom: 0,
    height: s(30),
    fontSize: s(13),
    backgroundColor: 'transparent',
    color: colors.black,
  },
  row: {
    height: s(35),
    width: s(300),
    paddingLeft: s(15),
    color: colors.black,
    borderTopColor: colors.darkgrey,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  separator: {
    marginHorizontal: s(13),
    height: 0.5,
    backgroundColor: colors.darkgrey,
  },
  icon: {
    position: 'absolute',
    top: s(8),
    left: s(8),
    width: s(14),
    height: s(14),
    tintColor: colors.darkgrey,
  },
});

const mapStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
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
  rIndContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: s(20),
  },
  rIndBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: 0.85,
    borderRadius: s(15),
  },
  radiusIndicator: {
    padding: s(10),
    fontSize: s(14),
    fontWeight: '600',
  },
  radius: {
    margin: s(30),
    fontSize: s(16),
    fontWeight: '800',
    color: colors.accent,
  },
});

export default MapScreen;
