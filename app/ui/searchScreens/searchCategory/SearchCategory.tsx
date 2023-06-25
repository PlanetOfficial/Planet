import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, SafeAreaView, Alert, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Filter from '../../components/Filter';

import {getPois} from '../../../utils/api/poiAPI';
import {Poi, Coordinate, Category} from '../../../utils/types';

import Results from './Results';

const SearchCategory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      mode: 'create' | 'suggest' | 'add' | 'none';
      location: Coordinate;
      radius: number;
      category: Category;
    };
  };
}) => {
  const {mode, location, radius, category} = route.params;

  const [places, setPlaces] = useState<Poi[]>([]);
  const [filters, setFilters] = useState<(number | number[])[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const filterRef = useRef<any>(null); // due to forwardRef

  const loadData = useCallback(async () => {
    setRefreshing(true);
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
      radius,
      location.latitude,
      location.longitude,
      _filters ? _filters : undefined,
    );
    if (data) {
      setPlaces(data);
    } else {
      Alert.alert(strings.error.error, strings.error.loadPlaces);
    }
    setRefreshing(false);
    setLoading(false);
  }, [category, filters, location.latitude, location.longitude, radius]);

  const loadBookmarks = useCallback(async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarks();
      loadData();
    });

    return unsubscribe;
  }, [navigation, loadBookmarks, loadData]);

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
  }, [category.filter]);

  useEffect(() => {
    loadData();
  }, [filters, loadData]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{category.name}</Text>
          <Icon
            icon={icons.pin}
            button={true}
            padding={-2}
            onPress={() =>
              navigation.navigate('SearchMap', {
                category,
                location,
                radius,
                mode,
              })
            }
          />
        </View>
      </SafeAreaView>

      {category.filter && category.filter.length > 0 ? (
        <Filter
          ref={filterRef}
          filters={category.filter}
          currFilters={filters}
          setCurrFilters={setFilters}
        />
      ) : null}

      {loading ? (
        <View style={STYLES.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <Results
          navigation={navigation}
          results={places}
          filterRef={filterRef}
          refreshing={refreshing}
          loadData={loadData}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          location={location}
          category={category}
          mode={mode}
        />
      )}
    </View>
  );
};

export default SearchCategory;
