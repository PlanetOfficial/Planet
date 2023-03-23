import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import MapView from 'react-native-maps';
import {Svg, Circle} from 'react-native-svg';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {miscIcons} from '../../constants/images';
import strings from '../../constants/strings';
import {integers, floats} from '../../constants/numbers';
import {colors} from '../../constants/theme';
import {calculateRadius} from '../../utils/functions/Misc';

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

  return (
    <View style={styles.container}>
      <View style={styles.top} />
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.x}
          onPress={() => navigation.navigate('TabStack')}>
          <Image style={headerStyles.icon} source={miscIcons.x} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>
          {strings.createTabStack.planEvent}
        </Text>
        <TouchableOpacity
          style={headerStyles.next}
          disabled={radius > integers.maxRadiusInMeters} // TODO: make this connected to the server in case this param changes
          onPress={() => {
            navigation.navigate('SelectGenres', {
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
            source={miscIcons.back}
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
            key: 'AIzaSyDu8hIYf0tLRW5Ux0O_x8GHjPw6jyJr59Y',
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
        <Image style={searchStyles.icon} source={miscIcons.search} />
      </View>

      <View style={mapStyles.container}>
        <MapView
          style={mapStyles.map}
          initialRegion={region}
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
              stroke={colors.accent}
              strokeWidth={4}
              fill={colors.accent}
              fillOpacity={0.2}
            />
          </Svg>
        </View>
        <Text style={mapStyles.radiusIndicator}>
          {' '}
          {/*TODO: Allow unit conversion + ft etc */}
          {strings.createTabStack.radius}:{' '}
          <Text
            style={
              radius <= integers.maxRadiusInMeters
                ? mapStyles.radius
                : mapStyles.radiusInvalid
            }>
            {Math.floor(radius / integers.milesToMeters)}
          </Text>{' '}
          mi
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  top: {
    position: 'absolute',
    width: '100%',
    height: vs(95),
    backgroundColor: colors.white,
    opacity: 0.8,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(50),
    width: s(300),
    height: vs(20),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  x: {
    width: vs(18),
    height: vs(18),
  },
  next: {
    width: vs(12),
    height: vs(18),
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
    marginTop: vs(10),
    width: s(300),
    backgroundColor: colors.white,
    borderRadius: vs(10),
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  textInput: {
    paddingVertical: 0,
    marginLeft: vs(20),
    paddingLeft: vs(10),
    marginBottom: 0,
    height: vs(30),
    fontSize: s(13),
    backgroundColor: 'transparent',
    color: colors.black,
  },
  row: {
    height: vs(35),
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
    top: vs(18),
    left: vs(8),
    width: vs(14),
    height: vs(14),
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
    marginTop: vs(30),
    width: s(300),
    height: s(300),
  },
  radiusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: s(20),
    padding: s(10),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.black,
  },
  radius: {
    margin: s(30),
    fontSize: s(16),
    fontWeight: '700',
    color: colors.accent,
  },
  radiusInvalid: {
    margin: s(30),
    fontSize: s(16),
    fontWeight: '700',
    color: 'red', // TODO: IMPORT THEME
  },
});

export default MapScreen;
