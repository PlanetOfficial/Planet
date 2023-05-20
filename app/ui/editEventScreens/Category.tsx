import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import strings from '../../constants/strings';

import Text from '../components/Text';
import OptionMenu from '../components/OptionMenu';
import PlacesDisplay from '../components/PlacesDisplay';

import {
  Place,
  Category as CategoryT,
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
  } = props;

  const childRef = useRef<any>(null); // due to forwardRef
  const closeDropdown = () => {
    childRef.current?.closeDropdown();
  };
  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  const [toBeRefreshed, setToBeRefreshed] = useState<boolean>(true);

  useEffect(() => {
    const loadDestinations = async (categoryId: number) => {
      setToBeRefreshed(false);
      const response = await getDestinations(
        categoryId,
        radius,
        latitude,
        longitude,
      );

      const _destinations: (Place | CategoryT)[] = [...destinations];
      const _destination: Place | CategoryT = _destinations[categoryIndex];
      if (isCategory(_destination) && response !== null) {
        _destination.options = response;
        setDestinations(_destinations);
      }
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
  ]);

  const isCategory = (item: Place | CategoryT): item is CategoryT => {
    return 'icon' in item;
  };

  return (
    <View key={category.id}>
      <View style={styles.header}>
        <View style={styles.categoryIconContainer}>
          <Image style={styles.categoryIcon} source={{uri: category.icon}} />
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
      {isCategory(destination) &&
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
    height: s(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Category;
