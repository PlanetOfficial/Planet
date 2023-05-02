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

import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import {genres} from '../../constants/genres';
import {integers} from '../../constants/numbers';

import PlaceCard from '../components/PlaceCard';
import Text from '../components/Text';
import Icon from '../components/Icon';
import Filter from '../editEventScreens/Filter';

import {getCatFiltered} from '../../utils/api/shared/getCatFiltered';
import {Subcategory} from '../../utils/interfaces/subcategory';

const LiveCategory = ({navigation, route}: {navigation: any; route: any}) => {
  const [longitude] = useState(route?.params?.longitude);
  const [latitude] = useState(route?.params?.latitude);
  const [categoryId] = useState(route?.params?.categoryId);
  const [categoryName] = useState(route?.params?.categoryName);
  const [subcategories, setSubcategories] = useState([]);
  const [hiddenSubCategories, setHiddenSubCategories] = useState([]);
  const [places, setPlaces]: [any, any] = useState({});
  const [loading, setLoading] = useState(false);

  const ref: any = useRef(null);

  let filters = genres[0].filters;

  const [filterValues, setFilterValues] = useState<number[]>([]);
  const [defaultFilterValues, setDefaultFilterValues] = useState<number[]>([]);

  useEffect(() => {
    let _defaultFilterValues: number[] = [];
    for (let i = 0; filters && i < filters.length; i++) {
      _defaultFilterValues.push(filters[i].defaultIdx);
    }
    setDefaultFilterValues(_defaultFilterValues);
    setFilterValues(_defaultFilterValues);
  }, [filters]);

  useEffect(() => {
    const initializeData = async () => {
      if (route?.params?.subcategories && filters) {
        setSubcategories(route?.params?.subcategories);

        const subcategoryIds: number[] = route?.params?.subcategories?.map(
          (item: any) => item.id,
        );

        setLoading(true);
        const response = await getCatFiltered(
          subcategoryIds,
          integers.defaultNumPlaces,
          latitude,
          longitude,
          filters[1].values[filterValues[1]], // time
          filters[0].values[filterValues[0]] * integers.milesToMeters, // radius
          categoryId,
          filters[2].values[filterValues[2]] === 1, // sort by distance
        );
        setPlaces(response?.places);
        setLoading(false);
      }

      if (route?.params?.hiddenSubCategories) {
        setHiddenSubCategories(route?.params?.hiddenSubCategories);
      }
    };

    initializeData();
  }, [
    categoryId,
    latitude,
    longitude,
    route?.params?.hiddenSubCategories,
    route?.params?.subcategories,
    filters,
    filterValues,
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
      {genres[0] && genres[0]?.filters && (
        <Filter
          ref={ref}
          filters={genres[0]?.filters}
          currFilters={filterValues}
          setCurrFilters={setFilterValues}
          defaultFilterValues={defaultFilterValues}
        />
      )}

      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : (
        <ScrollView onTouchStart={() => ref?.current?.closeDropdown()}>
          {subcategories?.map(
            (subcategory: Subcategory, idx: number) =>
              places[subcategory?.id] &&
              places[subcategory?.id].length > 0 && (
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
                    {places[subcategory?.id]
                      ? places[subcategory?.id].map(
                          (dest: any, jdx: number) => (
                            <TouchableOpacity
                              style={categoryStyles.card}
                              key={jdx}
                              onPress={() =>
                                navigation.navigate('Place', {
                                  destination: dest,
                                  category: categoryName,
                                })
                              }>
                              <PlaceCard
                                id={dest?.id}
                                name={dest?.name}
                                info={dest?.date}
                                marked={dest?.marked}
                                image={{uri: dest?.image_url}}
                              />
                            </TouchableOpacity>
                          ),
                        )
                      : null}
                  </ScrollView>
                  <Spacer />
                </View>
              ),
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
