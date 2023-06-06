import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import styles from '../../constants/styles';
import {defaultParams} from '../../constants/numbers';

import Text from '../components/Text';
import Separator from '../components/Separator';

import {Category, Coordinate, Genre} from '../../utils/interfaces/types';

const Search = ({navigation}: {navigation: any}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [location, setLocation] = useState<Coordinate>();

  const fetchUserLocation = async (): Promise<Coordinate> => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Error', 'Location permission denied.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    return new Promise(res => {
      Geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        res({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    });
  };

  const initializeData = async () => {
    const data = await AsyncStorage.getItem('genres');
    if (data) {
      setGenres(JSON.parse(data));
    } else {
      Alert.alert('Error', 'Unable to load genres. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      fetchUserLocation();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={genres}
        renderItem={({item}: {item: Genre}) => (
          <View style={categoryStyles.container}>
            <View style={categoryStyles.header}>
              <Text>{item.name}</Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={categoryStyles.scrollView}>
              {item.categories.map((category: Category) => (
                <TouchableOpacity
                  key={category.id}
                  style={categoryStyles.categoryContainer}
                  onPress={() => {
                    navigation.navigate('SearchCategory', {
                      category,
                      location,
                      radius: defaultParams.defaultRadius,
                    });
                  }}>
                  <View style={[categoryStyles.iconContainer, styles.shadow]}>
                    <Image
                      style={categoryStyles.icon}
                      source={{uri: category.icon.url}}
                    />
                  </View>
                  <Text size="xs" weight="l" center={true}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item: Genre) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const categoryStyles = StyleSheet.create({
  container: {
    paddingVertical: s(10),
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: s(5),
    paddingBottom: s(10),
  },
  scrollView: {
    paddingHorizontal: s(20),
    paddingVertical: s(5),
  },
  categoryContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(75),
    height: s(70),
    overflow: 'visible',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: colors.white,
  },
  icon: {
    width: '60%',
    height: '60%',
  },
});

export default Search;
