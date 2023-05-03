import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {s} from 'react-native-size-matters';

import Filter from './Filter';
import PlaceCard from '../components/PlaceCard';
import Text from '../components/Text';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import misc from '../../constants/misc';
import {colors} from '../../constants/theme';

// TODO: THIS FUNCTIONALITY IS INCOMPLETE, AND SO IS REFACTORING

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

interface Props {
  onClose: () => void;
  onSelect: (place: any) => void;
}

const AddFromLibrary: React.FC<Props> = ({onClose, onSelect}) => {
  const ref: any = useRef(null);

  let filters = misc.libraryFilter;

  const [filterValues, setFilterValues] = useState<number[]>([]);
  const [defaultFilterValues, setDefaultFilterValues] = useState<number[]>([]);

  useEffect(() => {
    let _defaultFilterValues: number[] = [];
    for (let i = 0; filters && i < filters.length; i++) {
      _defaultFilterValues.push(filters[i].defaultIdx);
    }
    setDefaultFilterValues(_defaultFilterValues);
    setFilterValues(_defaultFilterValues);
  }, [filters, defaultFilterValues]);

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

      <Filter
        ref={ref}
        filters={filters}
        currFilters={filterValues}
        setCurrFilters={setFilterValues}
        defaultFilterValues={defaultFilterValues}
      />

      <FlatList
        data={TempData}
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={5}
        keyExtractor={(item: any) => item?.id}
        ItemSeparatorComponent={Spacer}
        onTouchStart={() => ref?.current?.closeDropdown()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                onSelect(item);
                onClose();
              }}>
              <PlaceCard
                id={item?.id}
                name={item?.name}
                info={item?.category?.name}
                marked={true}
                image={
                  item?.image_url
                    ? {
                        uri: item?.image_url,
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
