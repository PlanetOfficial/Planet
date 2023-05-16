import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {s, vs} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import {Circle, Svg} from 'react-native-svg';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import Geolocation from '@react-native-community/geolocation';

import {calculateRadius} from '../../utils/functions/Misc';
import {GoogleMapsAPIKey} from '../../utils/api/APIConstants';

import {colors} from '../../constants/theme';
import {floats, integers} from '../../constants/numbers';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';

import Blur from '../components/Blur';
import Text from '../components/Text';
import Icon from '../components/Icon';

import {Place, Region} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  route: any;
}

const MapScreen: React.FC<Props> = ({navigation, route}) => {
  const [region, setRegion] = useState<Region>({
    latitude: floats.defaultLatitude,
    longitude: floats.defaultLongitude,
    latitudeDelta: floats.defaultLatitudeDelta,
    longitudeDelta: floats.defaultLongitudeDelta,
  });

  const [theDestination] = useState<Place>(route?.params?.destination);

  const [radius, setRadius] = useState<number>(
    calculateRadius(
      {latitude: floats.defaultLatitude, longitude: floats.defaultLongitude},
      floats.defaultLongitudeDelta,
    ),
  );

  const updateRadius = (reg: Region) => {
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
        error => {
          console.log(error);
        },
      );
    };

    if (theDestination) {
      setRegion({
        latitude: theDestination.latitude,
        longitude: theDestination.longitude,
        latitudeDelta: floats.defaultLatitudeDelta,
        longitudeDelta: floats.defaultLongitudeDelta,
      });
    } else {
      setCurrentLocation();
    }
  }, [theDestination]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const autoCompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
  const snapPoints = useMemo(
    () => [insets.bottom + s(55), vs(680) - (insets.top + s(50))],
    [insets.bottom, insets.top],
  );
  const handleSheetChange = useCallback(
    (_fromIndex: number, toIndex: number) => {
      if (toIndex === 0) {
        autoCompleteRef.current?.blur();
      } else {
        autoCompleteRef.current?.focus();
      }
    },
    [],
  );

  return (
    <View style={styles.container}>
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
          region={region}>
          {theDestination && (
            <Marker
              coordinate={{
                latitude: theDestination.latitude,
                longitude: theDestination.longitude,
              }}
            />
          )}
        </MapView>
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
          <Text size="s">{strings.createTabStack.radius + ': '}</Text>
          <Text size="s" weight="b" color={colors.accent}>
            {(radius / integers.milesToMeters).toFixed(1)}
          </Text>
          <Text size="s">{' ' + strings.createTabStack.milesAbbrev}</Text>
        </View>
      </View>

      <Blur height={s(40)} />

      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="s"
            icon={icons.x}
            onPress={() => navigation.navigate('TabStack')}
          />
          <Text>{strings.createTabStack.planEvent}</Text>
          <Icon
            size="s"
            icon={icons.next}
            disabled={radius > integers.maxRadiusInMeters}
            onPress={() => {
              navigation.navigate('SelectCategories', {
                latitude: region.latitude,
                longitude: region.longitude,
                radius: radius,
                theDestination: theDestination,
              });
            }}
          />
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={handleSheetChange}>
        <>
          <GooglePlacesAutocomplete
            ref={autoCompleteRef}
            placeholder={strings.createTabStack.search}
            disableScroll={true}
            isRowScrollable={false}
            enablePoweredByContainer={false}
            fetchDetails={true}
            query={{
              key: GoogleMapsAPIKey,
              language: 'en',
            }}
            textInputProps={{
              onFocus: () => {
                bottomSheetRef.current?.snapToIndex(1);
              },
            }}
            onPress={(_data, details = null) => {
              // As you can see if you turn these logs on, we get much more data than we're using. Maybe store in table?
              // console.log(data);
              // console.log(details);
              bottomSheetRef.current?.snapToIndex(0);
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
            styles={{
              container: searchStyles.container,
              textInputContainer: searchStyles.textInputContainer,
              textInput: searchStyles.textInput,
              row: searchStyles.row,
              separator: searchStyles.separator,
            }}
          />
          <Image style={searchStyles.icon} source={icons.search} />
        </>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(350),
    height: s(40),
    paddingHorizontal: s(20),
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
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    margin: s(10),
    padding: s(10),
    borderRadius: s(10),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flex: 0,
    marginHorizontal: s(20),
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
    backgroundColor: colors.white,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey,
  },
  icon: {
    position: 'absolute',
    top: s(7),
    left: s(27), // 20 + 7
    width: s(11),
    height: s(11),
    tintColor: colors.darkgrey,
  },
});

export default MapScreen;
