import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text as TextRN,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
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

import Text from '../components/Text';
import AButton from '../components/ActionButton';

import {GoogleMapsAPIKey} from '../../utils/api/APIConstants';
import {CustomPlace, Place, Region} from '../../utils/interfaces/types';
import {addCustomDestination} from '../../utils/api/shared/addCustomDestination';

interface Props {
  onClose: () => void;
  onSelect: (customDestination: Place) => void;
}

const AddCustomDest: React.FC<Props> = ({onClose, onSelect}) => {
  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
  const [region, setRegion] = useState<Region>({
    latitude: floats.defaultLatitude,
    longitude: floats.defaultLongitude,
    latitudeDelta: floats.defaultLatitudeDelta,
    longitudeDelta: floats.defaultLongitudeDelta,
  });

  const [customDestination, setCustomDestination] = useState<CustomPlace>();
  const [selected, setSelected] = useState<boolean>(false);
  const [custom, setCustom] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    autocompleteRef.current?.focus();
  }, []);

  const handleSelection = async () => {
    if (customDestination) {
      const response: Place | undefined = await addCustomDestination(
        customDestination.name,
        customDestination.latitude,
        customDestination.longitude,
        customDestination.formatted_address,
      );

      if (response) {
        onSelect(response);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }

      onClose();
    }
  };

  return (
    <View
      style={styles.container}
      onTouchEnd={() => {
        if (autocompleteRef.current?.getAddressText() === '') {
          setSelected(false);
        }
      }}>
      <View style={headerStyles.container}>
        <Text size="m" weight="b">
          {strings.library.addCustom}
        </Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>
      <GooglePlacesAutocomplete
        ref={autocompleteRef}
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
          selectTextOnFocus: true,
          onChangeText(textInput: string) {
            setText(textInput);
          },
          onFocus: () => {
            setCustom(true);
            setSelected(false);
          },
          onBlur(e) {
            if (e.nativeEvent.text !== '') {
              setSelected(true);
            }
          },
          placeholderTextColor: colors.darkgrey,
        }}
        onPress={(data, details = null) => {
          if (
            details?.geometry?.location?.lat &&
            details?.geometry?.location?.lng &&
            data?.structured_formatting?.main_text
          ) {
            setSelected(true);
            setRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: floats.defaultLatitudeDelta,
              longitudeDelta: floats.defaultLongitudeDelta,
            });
            setCustomDestination({
              name: data.structured_formatting.main_text,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              formatted_address: details?.formatted_address,
            });
            setCustom(false);
          }
        }}
        styles={{
          container: searchStyles.container,
          textInputContainer: searchStyles.textInputContainer,
          textInput: searchStyles.textInput,
          separator: searchStyles.separator,
        }}
        renderRow={rowData => <Text>{rowData.description}</Text>}
      />
      <Image style={searchStyles.icon} source={icons.search} />
      <View style={styles.contentContainer}>
        {selected ? (
          <>
            {custom ? (
              <Text center={true}>
                {strings.library.setCustomLocation + ':'}
              </Text>
            ) : null}
            <MapView
              style={styles.map}
              initialRegion={region}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={e =>
                custom && text !== ''
                  ? setCustomDestination({
                      name: text,
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                    })
                  : null
              }>
              <Marker
                coordinate={{
                  latitude: customDestination?.latitude
                    ? customDestination?.latitude
                    : floats.defaultLatitude,
                  longitude: customDestination?.longitude
                    ? customDestination?.longitude
                    : floats.defaultLongitude,
                }}
              />
            </MapView>
          </>
        ) : (
          <TextRN style={styles.text}>{strings.library.promptSearch}</TextRN>
        )}
      </View>
      <View style={styles.button}>
        <AButton
          disabled={!selected}
          label={strings.library.add}
          onPress={handleSelection}
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
