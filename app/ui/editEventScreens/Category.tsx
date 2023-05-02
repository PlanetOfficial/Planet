import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import strings from '../../constants/strings';
import Text from '../components/Text';
import OptionMenu from '../components/OptionMenu';
import Filter from './Filter';
import PlacesDisplay from '../components/PlacesDisplay';

interface ChildComponentProps {
  navigation: any;
  bookmarks: any[];
  category: {
    id: number;
    name: string;
    icon: any;
    filters?: any[];
    subcategories?: any[];
  };
  categoryIndex: number;
  selectionIndex: number;
  setSelectionIndex: (idx: number) => void;
  tempPlaces: any;
  onCategoryMove: any;
}

const TempData = [
  {
    id: 1,
    name: 'Place 1',
    category: {
      name: 'Category 1',
    },
    image_url: 'https://picsum.photos/200/300',
  },
  {
    id: 2,
    name: 'Place 2',
    category: {
      name: 'Category 2',
    },
    image_url: 'https://picsum.photos/200/300',
  },
  {
    id: 3,
    name: 'Place 3',
    category: {
      name: 'Category 3',
    },
    image_url: 'https://picsum.photos/200/300',
  },
  {
    id: 4,
    name: 'Place 4',
    category: {
      name: 'Category 4',
    },
    image_url: 'https://picsum.photos/200/300',
  },
];

const Category = forwardRef((props: ChildComponentProps, ref) => {
  const {
    navigation,
    bookmarks,
    category,
    categoryIndex,
    selectionIndex,
    setSelectionIndex,
    tempPlaces,
    onCategoryMove,
  } = props;

  const childRef: any = useRef(null);
  const closeDropdown = () => {
    childRef?.current?.closeDropdown();
  };
  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  // const [placeIdx, setPlaceIdx] = useState(0);

  let filters = category.filters;

  let defaultFilterValues: number[] = [];
  for (let i = 0; filters && i < filters.length; i++) {
    defaultFilterValues.push(filters[i].defaultIdx);
  }
  const [filterValues, setFilterValues] = useState(defaultFilterValues);

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
              disabled: categoryIndex === tempPlaces.length - 1,
            },
            {
              name: strings.main.remove,
              onPress: () => onCategoryMove(categoryIndex, 0),
              color: colors.red,
              disabled: tempPlaces.length === 1,
            },
          ]}
        />
      </View>
      {filters && (
        <Filter
          ref={childRef}
          filters={filters}
          subcategories={category.subcategories}
          currFilters={filterValues}
          setCurrFilters={setFilterValues}
          defaultFilterValues={defaultFilterValues}
        />
      )}
      <PlacesDisplay
        navigation={navigation}
        data={TempData}
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
