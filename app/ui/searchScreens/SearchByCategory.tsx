import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';
import {defaultParams} from '../../constants/numbers';

import Text from '../components/Text';
import Separator from '../components/Separator';

import {Coordinate, Place} from '../../utils/interfaces/types';
import {getPois} from '../../utils/api/poiOperations/poiAPI';
import Geolocation from '@react-native-community/geolocation';
import Icon from '../components/Icon';
import Filter from '../components/Filter';

const SearchByCategory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {category} = route.params;

  const [places, setPlaces] = useState<Place[]>([]);

  const [filters, setFilters] = useState<(number | number[])[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const setCurrentLocation = async () : Promise<Coordinate | null> => {
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

    Geolocation.getCurrentPosition(
      position => {
        const coordinate: Coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        return coordinate;
      },
      error => {
        console.warn(error);
      },
    );
    return null;
  };

  const loadData = async () => {
    setRefreshing(true);
    const coordinate: Coordinate | null = await setCurrentLocation();

    const _filters: {[key: string]: string | string[]} = {};
    for (let i = 0; i < category.filter.length; i++) {
      const filter = category.filter[i];
      const _filter = filters[i];
      if (Array.isArray(_filter)) {
        const filterValues: string[] = [];
        for (let j = 0; j < _filter.length; j++) {
          filterValues.push(filter.options[_filter[j]]);
        }
        _filters[filter.name] = filterValues;
      } else {
        _filters[filter.name] =
          filters[i] === -1 ? '' : filter.options[filters[i] as number];
      }
    }

    const data = await getPois(
      category,
      defaultParams.defaultRadius,
      coordinate ? coordinate.latitude : defaultParams.defaultLatitude,
      coordinate ? coordinate.longitude : defaultParams.defaultLongitude,
      _filters ? _filters : undefined,
    );
    if (data) {
      setPlaces(data);
    } else {
      Alert.alert('Error', 'Unable to load genres. Please try again.');
    }
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const _filters: (number | number[])[] = [];
    for (let i = 0; i < category.filter.length; i++) {
      if (category.filter[i].multi) {
        _filters.push([]);
      } else {
        _filters.push(category.filter[i].defaultIdx);
      }
    }
    setFilters(_filters);
  }, [category.filters]);

  useEffect(() => {
    loadData();
  }, [filters]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{category.name}</Text>
          <Icon
            icon={icons.map}
            button={true}
            onPress={() =>
              Alert.alert(
                'Sorry!',
                'Map search will be implemented post-beta :D',
              )
            }
          />
        </View>
      </SafeAreaView>

      {category.filter && category.filter.length > 0 ? (
        <Filter
          filters={category.filter}
          currFilters={filters}
          setCurrFilters={setFilters}
        />
      ) : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={places}
          renderItem={({item}: {item: Place}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log('hi');
                }}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No places found</Text>
            </View>
          }
          ItemSeparatorComponent={Separator}
          keyExtractor={(item: Place) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData()}
              tintColor={colors.accent}
            />
          }
        />
      )}
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: s(20),
    marginVertical: s(10),
  },
});

export default SearchByCategory;
