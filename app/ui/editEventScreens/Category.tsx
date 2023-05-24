import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import strings from '../../constants/strings';
import {icons} from '../../constants/images';

import Icon from '../components/Icon';
import Text from '../components/Text';
import OptionMenu from '../components/OptionMenu';
import PlacesDisplay from '../components/PlacesDisplay';
import Filter from './Filter';

import {
  Place,
  Category as CategoryT,
  Subcategory,
} from '../../utils/interfaces/types';
import {getDestinations} from '../../utils/api/destinationAPI';

interface ChildComponentProps {
  navigation: any;
  radius: number;
  latitude: number;
  longitude: number;
  bookmarks: number[];
  setBookmarked: (bookmark: boolean, id: number) => void;
  category: CategoryT;
  categoryIndex: number;
  destination: Place | CategoryT;
  selectionIndex: number;
  setSelectionIndex: (idx: number) => void;
  destinations: (Place | CategoryT)[];
  setDestinations: (destinations: (Place | CategoryT)[]) => void;
  onCategoryMove: (idx: number, direction: number) => void;
  onSubcategoryOpen?: (comp: React.ReactNode) => void;
  onSubcategorySelect?: () => void;
}

const Category = forwardRef((props: ChildComponentProps, ref) => {
  const {
    navigation,
    radius,
    latitude,
    longitude,
    bookmarks,
    setBookmarked,
    category,
    categoryIndex,
    destination,
    selectionIndex,
    setSelectionIndex,
    destinations,
    setDestinations,
    onCategoryMove,
    onSubcategoryOpen,
    onSubcategorySelect,
  } = props;

  const childRef = useRef<any>(null); // due to forwardRef
  const closeDropdown = () => {
    childRef.current?.closeDropdown();
  };
  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  const [loading, setLoading] = useState<boolean>(true);

  const [toBeRefreshed, setToBeRefreshed] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<(number | number[])[]>([]);

  const [subcategory, setSubcategory] = useState<Subcategory | null>();

  useEffect(() => {
    const loadDestinations = async (categoryId: number) => {
      setLoading(true);
      setToBeRefreshed(false);

      const _filters: {[key: string]: string | string[]} = {};
      for (let i = 0; i < category.filters.length; i++) {
        const filter = category.filters[i];
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

      const response = await getDestinations(
        categoryId,
        radius,
        latitude,
        longitude,
        _filters ? _filters : undefined,
        subcategory ? subcategory.id : undefined,
      );

      const _destinations: (Place | CategoryT)[] = [...destinations];
      const _destination: Place | CategoryT = _destinations[categoryIndex];
      if (isCategory(_destination) && response !== null) {
        _destination.options = response;
        setDestinations(_destinations);
      }
      setLoading(false);
    };

    if (isCategory(destination) && toBeRefreshed) {
      loadDestinations(category.id);
    }
  }, [
    category.id,
    category.subcategories,
    categoryIndex,
    latitude,
    longitude,
    radius,
    destination,
    destinations,
    setDestinations,
    toBeRefreshed,
    category.filters,
    filters,
    subcategory,
  ]);

  useEffect(() => {
    const _filters: (number | number[])[] = [];
    for (let i = 0; i < category.filters.length; i++) {
      if (category.filters[i].multi) {
        _filters.push([]);
      } else {
        _filters.push(category.filters[i].defaultIdx);
      }
    }
    setFilters(_filters);
  }, [category.filters]);

  useEffect(() => {
    setToBeRefreshed(true);
  }, [filters, subcategory]);

  const isCategory = (item: Place | CategoryT): item is CategoryT => {
    return 'icon' in item;
  };

  return (
    <View key={category.id}>
      <View style={styles.header}>
        <View style={styles.categoryIconContainer}>
          <Image style={styles.categoryIcon} source={{uri: category.icon}} />
        </View>
        {category.subcategories && category.subcategories.length > 0 ? (
          <TouchableOpacity
            style={styles.headerTitle}
            onPress={() =>
              onSubcategoryOpen
                ? onSubcategoryOpen(
                    <ScrollView
                      contentContainerStyle={styles.subcategoryContainer}>
                      {category.subcategories?.map(
                        (_subcategory: Subcategory, index: number) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.chip,
                              subcategory === _subcategory
                                ? {
                                    backgroundColor: colors.accentLight,
                                  }
                                : null,
                            ]}
                            onPress={() => {
                              setSubcategory
                                ? subcategory === _subcategory
                                  ? setSubcategory(null)
                                  : setSubcategory(_subcategory)
                                : null;
                              onSubcategorySelect
                                ? onSubcategorySelect()
                                : null;
                            }}>
                            <Text size="s" weight="l">
                              {_subcategory.name}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )}
                    </ScrollView>,
                  )
                : null
            }>
            <Text>{subcategory ? subcategory.name : category.name}</Text>
            <View style={styles.drop}>
              <Icon size="xs" icon={icons.drop} color={colors.accent} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerTitle}>
            <Text>{category.name}</Text>
          </View>
        )}
        <OptionMenu
          options={[
            {
              name: strings.createTabStack.moveUp,
              onPress: () => onCategoryMove(categoryIndex, -1),
              color: colors.black,
              disabled: categoryIndex === 0,
            },
            {
              name: strings.createTabStack.moveDown,
              onPress: () => onCategoryMove(categoryIndex, 1),
              color: colors.black,
              disabled: categoryIndex === destinations.length - 1,
            },
            {
              name: strings.main.remove,
              onPress: () => onCategoryMove(categoryIndex, 0),
              color: colors.red,
              disabled: destinations.length === 1,
            },
          ]}
        />
      </View>
<<<<<<< HEAD
=======

      {category.filters && category.filters.length > 0 ? (
        <Filter
          filters={category.filters}
          currFilters={filters}
          setCurrFilters={setFilters}
        />
      ) : null}

>>>>>>> main
      {loading ? (
        <View style={styles.noPlacesFound}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : isCategory(destination) &&
        destination.options &&
        Array.isArray(destination.options) &&
        destination.options.length > 0 ? (
        <PlacesDisplay
          navigation={navigation}
          places={destination.options}
          width={s(290)}
          bookmarks={bookmarks}
          setBookmarked={setBookmarked}
          closeDropdown={closeDropdown}
          index={selectionIndex}
          setIndex={setSelectionIndex}
        />
      ) : (
        <View style={styles.noPlacesFound}>
          <Text size="m" color={colors.darkgrey}>
            {strings.createTabStack.noPlaces}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(10),
    flex: 1,
  },
  categoryIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    borderWidth: 1,
    borderColor: colors.accent,
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
    borderRadius: s(17.5),
    tintColor: colors.black,
  },
  noPlacesFound: {
    height: s(135),
    alignItems: 'center',
    justifyContent: 'center',
  },
  drop: {
    marginLeft: s(4),
  },
  subcategoryContainer: {
    paddingHorizontal: s(15),
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    margin: s(5),
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: colors.accent,
  },
});

export default Category;
