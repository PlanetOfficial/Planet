import React, {useCallback, useMemo, useRef, useEffect, useState} from 'react';
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
import {s, vs} from 'react-native-size-matters';
import MapView from 'react-native-maps';
import {Svg, Circle} from 'react-native-svg';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import BottomSheet from '@gorhom/bottom-sheet';

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

  const bottomSheetRef: any = useRef<BottomSheet>(null);
  const autoCompleteRef: any = useRef<GooglePlacesAutocompleteRef>(null);
  const snapPoints = useMemo(
    () => [insets.bottom + s(55), vs(680) - (insets.top + s(35))],
    [insets.bottom, insets.top],
  );
  const handleSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex === 0) {
        autoCompleteRef?.current.blur();
      } else {
        autoCompleteRef?.current.focus();
      }
    },
    [],
  );

  return (
    <View testID="mapSelectionScreenView" style={styles.container}>
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
        <View
          style={[mapStyles.rIndContainer, {bottom: insets.bottom + s(55)}]}>
          {Platform.OS === 'ios' ? (
            <BlurView
              blurAmount={3}
              blurType="xlight"
              style={mapStyles.rIndBackground}
            />
          ) : (
            <View style={[mapStyles.rIndBackground, styles.nonBlur]} />
          )}
          <Text style={[mapStyles.radiusIndicator, {color: colors.black}]}>
            {strings.createTabStack.radius}
            {': '}
            <Text style={mapStyles.radius}>
              {(radius / integers.milesToMeters).toFixed(1)}
            </Text>{' '}
            {strings.createTabStack.milesAbbrev}
          </Text>
        </View>
      </View>
      {Platform.OS === 'ios' ? (
        <BlurView
          blurAmount={3}
          blurType="xlight"
          style={[styles.top, {height: insets.top + s(35)}]}
        />
      ) : (
        <View
          style={[
            styles.top,
            styles.nonBlur,
            {
              height: insets.top + s(35),
            },
          ]}
        />
      )}

      <SafeAreaView style={styles.headerContainer}>
        <View style={headerStyles.container}>
          <TouchableOpacity
            testID="mapSelectionScreenBack"
            style={headerStyles.x}
            onPress={() => navigation.navigate('TabStack')}>
            <Image style={headerStyles.icon} source={icons.x} />
          </TouchableOpacity>
          <Text style={headerStyles.title}>
            {strings.createTabStack.planEvent}
          </Text>
          <TouchableOpacity
            testID="mapSelectionNext"
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
              source={icons.next}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={handleSheetChange}
        backgroundStyle={bottomSheetStyle.background}>
        <View style={bottomSheetStyle.container} testID="searchLocationInput">
          <GooglePlacesAutocomplete
            ref={autoCompleteRef}
            textInputProps={{
              onFocus: () => {
                bottomSheetRef?.current.snapToIndex(1);
              },
            }}
            placeholder={strings.createTabStack.search}
            onPress={(data, details = null) => {
              bottomSheetRef?.current.snapToIndex(0);
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
              key: GoogleMapsAPIKey,
              language: 'en',
            }}
            enablePoweredByContainer={false}
            fetchDetails={true}
            styles={{
              container: searchStyles.container,
              textInputContainer: searchStyles.textInputContainer,
              textInput: searchStyles.textInput,
              row: searchStyles.row,
              separator: searchStyles.separator,
            }}
          />
          <Image style={searchStyles.icon} source={icons.search} />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  top: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  nonBlur: {backgroundColor: colors.white, opacity: 0.85},
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: s(30),
    paddingHorizontal: s(20),
    marginBottom: s(5),
  },
  title: {
    fontSize: s(16),
    fontWeight: '600',
    color: colors.black,
  },
  x: {
    width: s(18),
    height: s(18),
  },
  next: {
    width: s(18),
    height: s(18),
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

const bottomSheetStyle = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    opacity: 0.9,
  },
  container: {
    marginHorizontal: s(10),
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flex: 0,
    width: s(330),
    backgroundColor: 'transparent',
  },
  textInputContainer: {
    backgroundColor: colors.grey,
    borderRadius: s(10),
    marginBottom: s(10),
  },
  textInput: {
    paddingVertical: 0,
    marginLeft: s(15),
    paddingLeft: s(10),
    marginBottom: 0,
    height: s(25),
    fontSize: s(12),
    color: colors.black,
    backgroundColor: 'transparent',
  },
  row: {
    height: s(40),
    width: s(320),
    paddingLeft: s(10),
    color: colors.black,
    borderTopColor: colors.darkgrey,
    backgroundColor: 'transparent',
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey,
  },
  icon: {
    position: 'absolute',
    top: s(7),
    left: s(7),
    width: s(11),
    height: s(11),
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
    right: 0,
    margin: s(10),
  },
  rIndBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(10),
  },
  radiusIndicator: {
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    fontSize: s(13),
    fontWeight: '600',
  },
  radius: {
    margin: s(30),
    fontSize: s(15),
    fontWeight: '800',
    color: colors.accent,
  },
});

export default MapScreen;
