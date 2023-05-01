import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {floats} from '../../constants/numbers';
import CustomText from '../components/Text';

import {GoogleMapsAPIKey} from '../../utils/api/APIConstants';
import AButton from '../components/ActionButton';

interface Props {
  onClose: () => void;
  onSelect: (dest: any) => void;
}

const AddCustomDest: React.FC<Props> = ({onClose, onSelect}) => {
  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
  const [region, setRegion] = useState({
    latitude: floats.defaultLatitude,
    longitude: floats.defaultLongitude,
    latitudeDelta: floats.defaultLatitudeDelta,
    longitudeDelta: floats.defaultLongitudeDelta,
  });

  const [destination, setDestination]: [any, any] = useState();
  const [selected, setSelected] = useState(false);
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    autocompleteRef.current?.focus();
  }, []);

  return (
    <View
      style={styles.container}
      onTouchEnd={() => {
        if (autocompleteRef.current?.getAddressText() === '') {
          setSelected(false);
        }
      }}>
      <View style={headerStyles.container}>
        <CustomText size="m" weight="b">
          {strings.library.addCustom}
        </CustomText>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>
      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        textInputProps={{
          selectTextOnFocus: true,
          onFocus: () => {
            setCustom(true);
            setSelected(false);
          },
          onBlur(e) {
            if (e.nativeEvent.text !== '') {
              setSelected(true);
            }
          },
        }}
        placeholder={strings.createTabStack.search}
        onPress={(data: any, details = null) => {
          // As you can see if you turn these logs on, we get much more data than we're using. Maybe store in table?
          // console.log(data);
          // console.log(details);
          if (
            details?.geometry?.location?.lat &&
            details?.geometry?.location?.lng
          ) {
            setSelected(true);
            setRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: floats.defaultLatitudeDelta,
              longitudeDelta: floats.defaultLongitudeDelta,
            });
            setDestination({
              name: data?.structured_formatting?.main_text,
              address: data?.structured_formatting?.secondary_text,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
            setCustom(false);
          }
        }}
        query={{
          key: GoogleMapsAPIKey,
          language: 'en',
        }}
        disableScroll={true}
        isRowScrollable={false}
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
      <View style={styles.contentContainer}>
        {selected ? (
          <>
            {custom && (
              <Text style={styles.suggestText}>
                {strings.library.setCustomLocation + ':'}
              </Text>
            )}
            <MapView
              style={styles.map}
              initialRegion={region}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={e =>
                custom
                  ? setDestination({
                      name: autocompleteRef.current?.getAddressText(),
                      address: 'Custom Event',
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                    })
                  : null
              }>
              <Marker
                coordinate={{
                  latitude: destination?.latitude,
                  longitude: destination?.longitude,
                }}
              />
            </MapView>
          </>
        ) : (
          <Text style={styles.text}>{strings.library.promptSearch}</Text>
        )}
      </View>
      <View style={styles.button}>
        <AButton
          disabled={!selected}
          label={strings.library.add}
          onPress={() => {
            onClose();
            onSelect(destination);
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
  contentContainer: {
    flex: 1,
    marginHorizontal: s(20),
    marginVertical: s(20),
  },
  map: {
    flex: 1,
    borderRadius: s(10),
  },
  text: {
    marginTop: s(100),
    alignSelf: 'center',
    width: s(200),
    fontSize: s(18),
    lineHeight: s(30),
    fontWeight: '600',
    color: colors.darkgrey,
    textAlign: 'center',
  },
  suggestText: {
    alignSelf: 'center',
    fontSize: s(14),
    fontWeight: '500',
    color: colors.black,
    marginTop: -s(5),
    marginBottom: s(5),
  },
  button: {
    alignItems: 'center',
    marginBottom: s(40),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    marginBottom: s(10),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: s(20),
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: colors.grey,
  },
  x: {
    width: '50%',
    height: '50%',
    tintColor: colors.black,
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
    top: s(57), // 50 + 7
    left: s(27), // 20 + 7
    width: s(11),
    height: s(11),
    tintColor: colors.darkgrey,
  },
});

export default AddCustomDest;
