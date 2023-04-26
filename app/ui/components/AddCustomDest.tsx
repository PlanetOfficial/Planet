import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import {s} from 'react-native-size-matters';
import MapView from 'react-native-maps';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {integers, floats} from '../../constants/numbers';
import {calculateRadius} from '../../utils/functions/Misc';

import {GoogleMapsAPIKey} from '../../utils/api/APIConstants';

const AddCustomDest = ({onClose, onSelect}: {onClose: any; onSelect: any}) => {
  const autoCompleteRef: any = useRef<GooglePlacesAutocompleteRef>();
  const [region, setRegion] = useState({
    latitude: floats.defaultLatitude,
    longitude: floats.defaultLongitude,
    latitudeDelta: floats.defaultLatitudeDelta,
    longitudeDelta: floats.defaultLongitudeDelta,
  });

  return (
    <View style={styles.container}>
      <View style={headerStyles.container}>
        <Text style={headerStyles.title}>{strings.library.addCustom}</Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>
      <View style={styles.autoCompleteContainer}>
        <GooglePlacesAutocomplete
          ref={autoCompleteRef}
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
            key: GoogleMapsAPIKey,
            language: 'en',
          }}
          disableScroll={true}
          isRowScrollable={false}
          enablePoweredByContainer={false}
          fetchDetails={true}
          numberOfLines={10}
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
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
      />
      <TouchableOpacity
        style={buttonStyles.container}
        onPress={() => {
          onSelect();
        }}>
        <Text style={buttonStyles.title}>{strings.library.add}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autoCompleteContainer: {
    width: s(350),
    height: s(20),
  },
  contentContainer: {
    marginHorizontal: s(20),
    paddingTop: s(20),
    paddingBottom: s(40),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
  card: {
    alignSelf: 'center',
    width: s(280),
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '150%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  map: {
    flex: 1,
    width: s(310),
    marginHorizontal: s(20),
    marginVertical: s(20),
    borderRadius: s(10),
  }
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    marginBottom: s(10),
  },
  title: {
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
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
    alignSelf: 'center',
    width: s(310),
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
    left: s(27),
    width: s(11),
    height: s(11),
    tintColor: colors.darkgrey,
  },
});

const buttonStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: s(120),
    height: s(40),
    marginBottom: s(50),
    borderRadius: s(10),
    backgroundColor: colors.accent,
  },
  title: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.white,
  },
});

export default AddCustomDest;
