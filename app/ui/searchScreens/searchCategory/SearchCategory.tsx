import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Filter from '../../components/Filter';

import BookmarkContext from '../../../context/BookmarkContext';

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
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {mode, location, radius, category} = route.params;

  const [places, setPlaces] = useState<Poi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const filterInit: (number | number[])[] = [];
  for (let i = 0; i < category.filter.length; i++) {
    if (category.filter[i].multi) {
      filterInit.push([]);
    } else {
      filterInit.push(category.filter[i].defaultIdx);
    }
  }
  const [filters, setFilters] = useState<(number | number[])[]>(filterInit);

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  const filterRef = useRef<any>(null); // due to forwardRef

  useEffect(() => {
    const loadData = async (_filters: {[key: string]: string | string[]}) => {
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
      setLoading(false);
    };

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
    setLoading(true);
    loadData(_filters);
  }, [category, filters, location.latitude, location.longitude, radius]);

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
          <ActivityIndicator size="small" color={colors[theme].accent} />
        </View>
      ) : (
        <Results
          navigation={navigation}
          results={places}
          filterRef={filterRef}
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
