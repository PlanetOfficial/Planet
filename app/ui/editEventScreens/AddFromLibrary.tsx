import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import PlaceCard from '../components/PlaceCard';
import Text from '../components/Text';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
// import misc from '../../constants/misc';
import {colors} from '../../constants/theme';

import {getPlaces} from '../../utils/api/placeAPI';
import {Place} from '../../utils/interfaces/types';
import {getPlaceCardString} from '../../utils/functions/Misc';

interface Props {
  onClose: () => void;
  onSelect: (place: Place) => void;
}

const AddFromLibrary: React.FC<Props> = ({onClose, onSelect}) => {
  const filterRef = useRef<any>(null); // due to forwardRef

  // let filters = misc.libraryFilter;

  // const [filterValues, setFilterValues] = useState<number[]>([]);
  // const [defaultFilterValues, setDefaultFilterValues] = useState<number[]>([]);
  // const [filtersInitialized, setFiltersInitialized] = useState<boolean>(false);

  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      // TODO: implement filters

      const _bookmarks = await getPlaces();
      if (_bookmarks) {
        setPlaces(_bookmarks);
      } else {
        Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
      }
    };

    initializeData();
  }, []);

  // useEffect(() => {
  //   const initializeFilterValues = () => {
  //     let _defaultFilterValues: number[] = [];
  //     for (let i = 0; filters && i < filters.length; i++) {
  //       _defaultFilterValues.push(filters[i].defaultIdx);
  //     }
  //     setDefaultFilterValues(_defaultFilterValues);
  //     setFilterValues(_defaultFilterValues);
  //     setFiltersInitialized(true);
  //   };

  //   if (!filtersInitialized) {
  //     initializeFilterValues();
  //   }
  // }, [filters, filtersInitialized]);

  return (
    <View style={styles.container}>
      <View style={headerStyles.container}>
        <Text size="m" weight="b">
          {strings.library.addFromLibrary}
        </Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>

      {/* <Filter
        ref={filterRef}
        filters={filters}
        currFilters={filterValues}
        setCurrFilters={setFilterValues}
        defaultFilterValues={defaultFilterValues}
      /> */}

      <FlatList
        data={places}
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={5}
        keyExtractor={(item: Place) => item.id.toString()}
        ItemSeparatorComponent={Spacer}
        onTouchStart={() => filterRef.current?.closeDropdown()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                onSelect(item);
                onClose();
              }}>
              <PlaceCard
                id={item.id}
                name={item.name}
                info={getPlaceCardString(item)}
                bookmarked={true}
                setBookmarked={(bookmarked: boolean, id: number) => {
                  if (!bookmarked) {
                    setPlaces(places.filter((place: Place) => place.id !== id));
                  }
                }}
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
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingTop: s(20),
    paddingBottom: s(40),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
  card: {
    alignSelf: 'center',
    width: s(290),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: s(40),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: s(20),
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: colors.grey,
  },
  x: {
    width: '50%',
    height: '50%',
    tintColor: colors.black,
  },
});

export default AddFromLibrary;
