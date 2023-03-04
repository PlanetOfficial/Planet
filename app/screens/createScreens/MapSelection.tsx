import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import MapView, {Circle} from 'react-native-maps';

import images from '../../constants/icons';
import strings from '../../constants/strings';
import integers from '../../constants/integers';
import { colors } from '../../constants/colors';

const MapScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState('');
  const [latitude, setLatitude] = useState(37.78825);
  const [longitude, setLongitude] = useState(-122.4324);

  const getRadius = () => {
    if (!Number.isNaN(parseFloat(radius))) {
      return parseFloat(radius) * integers.milesToMeters;
    }

    return 0;
  };

  const onRegionChange = reg => {
    setLatitude(reg.latitude);
    setLongitude(reg.longitude);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('TabStack')}>
          <Image source={images.XButton} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {strings.createTabStack.planEvent}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (getRadius() !== 0) {
              navigation.navigate('SelectGenres', {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
              });
            }
          }}>
          <Image source={images.NextArrow} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={text => setSearch(text)}
            placeholder={strings.createTabStack.search}
            style={styles.searchBar}
          />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            value={radius}
            onChangeText={text => setRadius(text)}
            placeholder={strings.createTabStack.radius}
            style={styles.searchBar}
          />
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={onRegionChange}>
          <Circle
            center={{latitude: latitude, longitude: longitude}}
            radius={getRadius()}
          />
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  header: {
    height: 60,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    paddingRight: 15,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    marginVertical: 10,
  },
  searchBar: {
    height: 40,
    borderRadius: 17.5,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
});

export default MapScreen;
