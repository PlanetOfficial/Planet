import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import MapView, { Details, Region} from 'react-native-maps';
import { Svg, Circle } from 'react-native-svg';

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
      {Header(latitude, longitude, radius, navigation)}
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
    onRegionChange={onRegionChange}>
    </MapView>
    <View style={searchStyles.container}>
      <Image style={searchStyles.icon} source={miscIcons.search}/>
      <TextInput
        value={search}
        onChangeText={text => setSearch(text)}
        placeholder={strings.createTabStack.search}
        style={searchStyles.text}
        placeholderTextColor={colors.darkgrey}
      />
    </View>
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
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(50),
    width: s(300),
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

const mapStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: vs(85),
    width: '100%',
    height: vs(595),
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
  }
});

const searchStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: vs(10),
    width: s(300),
    height: s(30),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  icon: {
    marginLeft: s(10),
    width: s(16),
    height: s(16),
    tintColor: colors.black,
  },
  text: {
    flex: 1,
    marginLeft: s(10),
    color: colors.black,
  },
});

export default MapScreen;
