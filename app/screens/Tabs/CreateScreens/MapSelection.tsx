import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image } from 'react-native';
import MapView from 'react-native-maps';

import images from '../../../constants/Images';

const MapScreen = ({navigation}) => {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TabStack')}
        >
          <Image
            source={images.XButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan an Event</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SelectCategories')}
        >
          <Image
            source={images.NextArrow}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={text => setSearch(text)}
            placeholder="Search"
            style={styles.searchBar}
          />
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    paddingRight: 15
  },
  container: {
    flex: 1,
    padding: 10
  },
  searchContainer: {
    marginVertical: 10
  },
  searchBar: {
    height: 40,
    borderRadius: 17.5,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16
  },
  map: {
    flex: 1,
    marginTop: 10
  }
});

export default MapScreen;
