import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';
import {colors} from '../../constants/theme';
import strings from '../../constants/strings';
import Text from '../components/Text';
import OptionMenu from '../components/OptionMenu';
import Filter from './Filter';
import PlacesDisplay from '../components/PlacesDisplay';
import {integers} from '../../constants/numbers';

import {
  Place,
  Category as CategoryT,
  Filter as FilterT,
} from '../../utils/interfaces/types';

interface ChildComponentProps {
  navigation: any;
  radius: number;
  latitude: number;
  longitude: number;
  bookmarks: number[];
  category: CategoryT;
  categoryIndex: number;
  destination: Place | CategoryT;
  selectionIndex: number;
  setSelectionIndex: (idx: number) => void;
  destinations: (Place | CategoryT)[];
  setDestinations: (destinations: (Place | CategoryT)[]) => void;
  onCategoryMove: (idx: number, direction: number) => void;
}

const Category = forwardRef((props: ChildComponentProps, ref) => {
  const {
    navigation,
    radius,
    latitude,
    longitude,
    bookmarks,
    category,
    categoryIndex,
    destination,
    selectionIndex,
    setSelectionIndex,
    destinations,
    setDestinations,
    onCategoryMove,
  } = props;

  const childRef = useRef<any>(null);
  const closeDropdown = () => {
    childRef.current?.closeDropdown();
  };
  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  // let filters: FilterT[] = category.filters ? category.filters : [];
  let filters: FilterT[] = [];
  const [filterValues, setFilterValues] = useState<number[]>([]);
  const [defaultFilterValues] = useState<number[]>([]);

  // useEffect(() => {
  //   let _defaultFilterValues: number[] = [];
  //   for (let i = 0; filters && i < filters.length; i++) {
  //     _defaultFilterValues.push(filters[i].defaultIdx);
  //   }
  //   setDefaultFilterValues(_defaultFilterValues);
  //   setFilterValues(_defaultFilterValues);
  // }, [filters]);

  useEffect(() => {
    const loadDestinations = async (categoryId: number) => {
      const response = await requestLocations(
        [categoryId],
        radius,
        latitude,
        longitude,
        integers.defaultNumPlaces,
      );

      const _destinations: (Place | CategoryT)[] = [...destinations];
      const _destination: Place | CategoryT = _destinations[categoryIndex];
      if (isCategory(_destination)) {
        _destination.options = response[categoryId];
        setDestinations(_destinations);
      }
    };

    if (isCategory(destination) && destination.options?.length === 0) {
      loadDestinations(category.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCategory = (item: Place | CategoryT): item is CategoryT => {
    return 'icon' in item;
  };

  return (
    <View key={category.id}>
      <View style={styles.header}>
        <View style={styles.categoryIconContainer}>
          <Image style={styles.categoryIcon} source={category.icon} />
        </View>
        <View style={styles.headerTitle}>
          <Text>{category.name}</Text>
        </View>
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
      {filters.length > 0 ? (
        <Filter
          ref={childRef}
          filters={filters}
          subcategories={category.subcategories}
          currFilters={filterValues}
          setCurrFilters={setFilterValues}
          defaultFilterValues={defaultFilterValues}
        />
      ) : null}
      <PlacesDisplay
        navigation={navigation}
        places={
          isCategory(destination) && destination.options
            ? destination.options
            : []
        }
        width={s(290)}
        bookmarks={bookmarks}
        closeDropdown={closeDropdown}
        index={selectionIndex}
        setIndex={setSelectionIndex}
      />
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
});

export default Category;
