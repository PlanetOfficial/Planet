import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Separator from '../components/Separator';

import {Poi} from '../../utils/types';
import {getPois} from '../../utils/api/poiAPI';
import Icon from '../components/Icon';
import Filter from '../components/Filter';
import strings from '../../constants/strings';
import PoiRow from '../components/PoiRow';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchCategory = ({navigation, route}: {navigation: any; route: any}) => {
  const {category, location, radius} = route.params;

  const [places, setPlaces] = useState<Poi[]>([]);
  const [filters, setFilters] = useState<(number | number[])[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const filterRef = useRef<any>(null); // due to forwardRef

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

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
      Alert.alert('Error', 'Unable to load places. Please try again.');
    }
    setRefreshing(false);
    setLoading(false);
  }, [category, filters, location.latitude, location.longitude, radius]);

  const initializeData = async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      loadData();
    });

    return unsubscribe;
  }, [navigation, loadData]);

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
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
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
              navigation.navigate('SearchMap', {
                category,
                location,
                radius,
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
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={places}
          onTouchStart={() => filterRef.current?.closeDropdown()}
          renderItem={({item}: {item: Poi}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PoiDetail', {
                    poi: item,
                    bookmarked: false,
                  })
                }>
                <PoiRow
                  poi={item}
                  bookmarked={bookmarks.some((bookmark) => bookmark.id === item.id)}
                  location={location}
                  category={category}
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>{strings.search.noResultsFound}</Text>
              <Text> </Text>
              <Text size="s" color={colors.darkgrey}>
                {strings.search.noResultsFoundDescription}
              </Text>
            </View>
          }
          ItemSeparatorComponent={Separator}
          keyExtractor={(item: Poi) => item.id.toString()}
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

export default SearchCategory;
