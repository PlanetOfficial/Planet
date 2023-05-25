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
  Alert,
  FlatList,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import strings from '../../constants/strings';
import {icons} from '../../constants/images';

import Icon from '../components/Icon';
import Text from '../components/Text';
import Filter from '../editEventScreens/Filter';

import {Place, Category, Subcategory} from '../../utils/interfaces/types';
import {getDestinations} from '../../utils/api/destinationAPI';
import PlaceCard from '../components/PlaceCard';

interface ChildComponentProps {
  radius: number;
  latitude: number;
  longitude: number;
  bookmarks: number[];
  setBookmarked: (bookmark: boolean, place: Place) => void;
  category: Category;
  onSubcategoryOpen?: (comp: React.ReactNode) => void;
  onSubcategorySelect?: () => void;
  onClose: () => void;
  onSelect: (place: Place) => void;
}

const AddFromCategory = forwardRef((props: ChildComponentProps, ref) => {
  const {
    radius,
    latitude,
    longitude,
    bookmarks,
    setBookmarked,
    category,
    onSubcategoryOpen,
    onSubcategorySelect,
    onClose,
    onSelect,
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

  const [filters, setFilters] = useState<(number | number[])[]>([]);

  const [subcategory, setSubcategory] = useState<Subcategory | null>();

  const [destinations, setDestinations] = useState<Place[]>();

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

      if (response) {
        setDestinations(response);
      } else {
        Alert.alert('Error', 'Unable to load destinations. Please try again.');
      }
      setLoading(false);
    };

    if (toBeRefreshed) {
      loadDestinations(category.id);
    }
  }, [
    category.id,
    category.subcategories,
    latitude,
    longitude,
    radius,
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
      </View>

      {category.filters && category.filters.length > 0 ? (
        <Filter
          filters={category.filters}
          currFilters={filters}
          setCurrFilters={setFilters}
        />
      ) : null}

      {loading ? (
        <View style={styles.noPlacesFound}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={destinations}
          contentContainerStyle={styles.contentContainer}
          initialNumToRender={5}
          keyExtractor={(item: Place) => item.id.toString()}
          ItemSeparatorComponent={Spacer}
          onTouchStart={() => childRef.current?.closeDropdown()}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text color={colors.darkgrey} center={true}>
                {strings.library.noSaved}
              </Text>
            </View>
          }
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}>
                <PlaceCard
                  place={item}
                  bookmarked={bookmarks.includes(item.id)}
                  setBookmarked={setBookmarked}
                  image={
                    item.photo
                      ? {
                          uri: item.photo,
                        }
                      : icons.defaultIcon
                  }
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
});

const Spacer = () => <View style={styles.separator} />;

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
  contentContainer: {
    paddingTop: s(20),
    paddingBottom: s(40),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
    marginHorizontal: s(20),
  },
  card: {
    alignSelf: 'center',
    width: s(290),
  },
  center: {
    height: s(400),
    justifyContent: 'center',
  },
});

export default AddFromCategory;
