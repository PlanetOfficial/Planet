import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {s} from 'react-native-size-matters';

import moment from 'moment';

import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import {integers} from '../../constants/numbers';

import PlaceCard from '../components/PlaceCard';
import Text from '../components/Text';
import Icon from '../components/Icon';
import Filter from '../editEventScreens/Filter';

import {getCatFiltered} from '../../utils/api/shared/getCatFiltered';
import {
  Filter as FilterT,
  LiveEvent,
  LiveEvents,
  Subcategory,
} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  route: any;
}

const LiveCategory: React.FC<Props> = ({navigation, route}) => {
  const [longitude] = useState<number>(route?.params?.longitude);
  const [latitude] = useState<number>(route?.params?.latitude);
  const [categoryId] = useState<number>(route?.params?.categoryId);
  const [filters] = useState<FilterT[]>(route?.params?.filters);
  const [categoryName] = useState<string>(route?.params?.categoryName);
  const [bookmarks] = useState<number[]>(route?.params?.bookmarks);
  const [subcategories, setSubcategories] = useState<Subcategory[]>();
  const [hiddenSubCategories, setHiddenSubCategories] = useState<Subcategory[]>(
    [],
  );
  const [liveEvents, setLiveEvents] = useState<LiveEvents>({});
  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<any>(null); // due to forwardRef

  const [filterValues, setFilterValues] = useState<(number | number[])[]>([]);
  const [defaultFilterValues, setDefaultFilterValues] = useState<
    (number | number[])[]
  >([]);
  const [filtersInitialized, setFiltersInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeData = async () => {
      if (route?.params?.subcategories && filters) {
        setSubcategories(route?.params?.subcategories);

        const subcategoryIds: number[] = route?.params?.subcategories?.map(
          (subcategory: Subcategory) => subcategory.id,
        );

        setLoading(true);
        const response = await getCatFiltered(
          subcategoryIds,
          integers.defaultNumPlaces,
          latitude,
          longitude,
          categoryId,
          filters,
          filterValues,
        );
        setLiveEvents(response?.places);
        setLoading(false);
      }

      if (route?.params?.hiddenSubCategories) {
        setHiddenSubCategories(route?.params?.hiddenSubCategories);
      }
    };

    const initializeFilterValues = () => {
      let _defaultFilterValues: (number | number[])[] = [];
      for (let i = 0; filters && i < filters.length; i++) {
        _defaultFilterValues.push(filters[i].defaultIdx);
      }
      setDefaultFilterValues(_defaultFilterValues);
      setFilterValues(_defaultFilterValues);
      setFiltersInitialized(true);
    };

    if (!filtersInitialized) {
      initializeFilterValues();
    } else {
      initializeData();
    }
  }, [
    categoryId,
    latitude,
    longitude,
    route?.params?.hiddenSubCategories,
    route?.params?.subcategories,
    filters,
    filterValues,
    filtersInitialized,
  ]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.navigate('Trending')}
          />
          <View style={headerStyles.row}>
            <Text size="xl" weight="b">
              {categoryName}
            </Text>
            <Icon
              icon={icons.settings}
              onPress={() => {
                navigation.navigate('LiveCategorySettings', {
                  subcategories,
                  hiddenSubCategories,
                });
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      {filters ? (
        <Filter
          ref={ref}
          filters={filters}
          currFilters={filterValues}
          setCurrFilters={setFilterValues}
          defaultFilterValues={defaultFilterValues}
        />
      ) : null}

      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : (
        <ScrollView onTouchStart={() => ref.current?.closeDropdown()}>
          {subcategories?.map((subcategory: Subcategory, idx: number) =>
            liveEvents &&
            liveEvents[subcategory.id] &&
            liveEvents[subcategory.id].length > 0 ? (
              <View key={idx} style={categoryStyles.container}>
                <View style={categoryStyles.header}>
                  <Text size="m" weight="b">
                    {subcategory.title}
                  </Text>
                </View>
                <ScrollView
                  contentContainerStyle={categoryStyles.contentContainer}
                  style={categoryStyles.scrollView}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {liveEvents[subcategory.id]
                    ? liveEvents[subcategory.id].map(
                        (event: LiveEvent, jdx: number) => (
                          <TouchableOpacity
                            style={categoryStyles.card}
                            key={jdx}
                            onPress={() =>
                              navigation.navigate('Place', {
                                destination: event,
                                category: categoryName,
                              })
                            }>
                            <PlaceCard
                              id={event.id}
                              small={true}
                              name={event.name}
                              info={
                                moment(event.date, 'YYYY-MM-DD').format(
                                  'M/D/YYYY',
                                ) +
                                (event.priceRanges[0]
                                  ? ' • ' +
                                    '$' +
                                    Math.round(event.priceRanges[0]?.min) +
                                    (event.priceRanges[0].min !==
                                    event.priceRanges[0].max
                                      ? ' - ' +
                                        '$' +
                                        Math.round(event.priceRanges[0]?.max)
                                      : '')
                                  : '')
                              }
                              marked={bookmarks.includes(event.id)}
                              image={{uri: event.image_url}}
                            />
                          </TouchableOpacity>
                        ),
                      )
                    : null}
                </ScrollView>
                <Spacer />
              </View>
            ) : null,
          )}
        </ScrollView>
      )}
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginLeft: s(20),
    marginTop: s(10),
  },
  bottomPadding: {
    height: s(20),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    marginTop: s(15),
    marginHorizontal: s(20),
  },
  button: {
    width: s(30),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: s(10),
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
  },
  header: {
    marginHorizontal: s(20),
    marginBottom: s(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: s(250),
    marginRight: s(10),
  },
  scrollView: {
    overflow: 'visible',
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
  },
});

export default LiveCategory;
