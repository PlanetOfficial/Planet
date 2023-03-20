import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import MapView, { Details, Region} from 'react-native-maps';
import { Svg, Circle } from 'react-native-svg';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import {miscIcons} from '../../constants/images';
import strings from '../../constants/strings';
import integers from '../../constants/integers';
import {colors} from '../../constants/theme';

const MapScreen = ({navigation}: {navigation: any}) => {
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState(2 * integers.milesToMeters);
  const [latitude, setLatitude] = useState(37.78825);
  const [longitude, setLongitude] = useState(-122.4324);

  const onRegionChange = (reg: any) => {
    setLatitude(reg.latitude);
    setLongitude(reg.longitude);
    setRadius(reg.radius);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}/>
      {Header(latitude, longitude, radius, navigation)}
      {Search()}
      {Map(latitude, longitude, radius, search, setSearch, onRegionChange)} 
    </View>
  );
};

const Header = (
  latitude: number,
  longitude: number,
  radius: number,
  navigation: any,
) => (
  <View style={headerStyles.container}>
    <TouchableOpacity
      style={headerStyles.x}
      onPress={() => navigation.navigate('TabStack')}>
      <Image style={headerStyles.icon} source={miscIcons.x} />
    </TouchableOpacity>
    <Text style={headerStyles.title}>{strings.createTabStack.planEvent}</Text>
    <TouchableOpacity
      style={headerStyles.next}
      onPress={() => {
        navigation.navigate('SelectGenres', {
          latitude: latitude,
          longitude: longitude,
          radius: radius,
        });
      }}>
      <Image style={headerStyles.icon} source={miscIcons.back} />
    </TouchableOpacity>
  </View>
);

const Search = () => (
  <View>
    <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{ // TODO: Use ENV obviously
        key: 'AIzaSyDu8hIYf0tLRW5Ux0O_x8GHjPw6jyJr59Y',
        language: 'en',
      }}
      enablePoweredByContainer={false}
      styles={{
        container: searchStyles.container,
        textInput: searchStyles.textInput,
        row: searchStyles.row,
        separator: searchStyles.separator,
      }}
    />
    <Image style={searchStyles.icon} source={miscIcons.search}/>
  </View>
);

const Map = (latitude: number, longitude: number, radius: number, search: string, setSearch: ((arg0: string) => void), onRegionChange: ((region: Region, details: Details) => void)) => (
  <View style={mapStyles.container}>
    <MapView
      style={mapStyles.map}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsScale={false}
      showsCompass={false}
      onRegionChange={onRegionChange}
    />
    <View pointerEvents={"none"} style={mapStyles.circle}>
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
  </View>
);

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
  }
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
    }
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
  }
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
  }
});

export default MapScreen;
