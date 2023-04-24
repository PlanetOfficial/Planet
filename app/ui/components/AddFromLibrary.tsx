import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';
import EncryptedStorage from 'react-native-encrypted-storage';

import PlaceCard from '../components/PlaceCard';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';

import { genres } from '../../constants/categories';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import misc from '../../constants/misc';
import {colors} from '../../constants/theme';

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
]

const AddFromLibrary = ({
  navigation,
  onClose,
  onSelect,
}: {
  navigation: any;
  onClose: any;
  onSelect: any;
}) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const bookmarks = await getBookmarks(authToken);
      setPlaces(bookmarks);
    };

    initializeData();
  }, []);

  const [radius, setRadius] = useState(0);
  const [sort, setSort] = useState(0);

  const [dropdownStatus, setDropdownStatus]: [any, any] = useState('');

  const radiusRef: any = React.useRef(null);
  const sortRef: any = React.useRef(null);
  const [pos, setPos]: [number, any] = useState(0);
  const [width, setWidth]: [number, any] = useState(0);
  const handleMeasure = (ref: any) => {
    ref.current.measureInWindow((x: any, y: any, w: any) => {
      if (x < s(10)) {
        setPos(s(10));
      } else if (x + w > s(340)) {
        setPos(s(340) - w);
      } else {
        setPos(x);
      }
      setWidth(w);
    });
  };
  const handleRadiusOptionPress = (option: any) => {
    setRadius(option);
    closeDropdown();
  };
  const handleSortOptionPress = (option: any) => {
    setSort(option);
    closeDropdown();
  };
  const closeDropdown = () => {
    setDropdownStatus('');
    setPos(0);
    setWidth(0);
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.container}>
        <Text style={headerStyles.title}>{strings.library.addFromLibrary}</Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>
      <View style={filterStyles.container}>
        <ScrollView
          onScrollBeginDrag={() => closeDropdown()}
          horizontal={true}
          style={[filterStyles.scrollView]}
          contentContainerStyle={[filterStyles.contentContainer]}
          showsHorizontalScrollIndicator={false}>
          <View style={filterStyles.chipContainer}>
            <TouchableOpacity
              ref={radiusRef}
              style={filterStyles.chip}
              onPress={() => {
                if (dropdownStatus === 'radius') {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  setDropdownStatus('radius');
                  handleMeasure(radiusRef);
                }
              }}>
              <Text
                style={[
                  filterStyles.text,
                  {
                    color:
                      dropdownStatus === 'radius'
                        ? colors.darkgrey
                        : colors.black,
                  },
                ]}>
                {strings.filter.within +
                  ': ' +
                  misc.libraryFilter.radius[radius] +
                  strings.createTabStack.milesAbbrev}
              </Text>
              <View style={filterStyles.drop}>
                <Image
                  style={[
                    filterStyles.icon,
                    {
                      tintColor:
                        dropdownStatus === 'radius'
                          ? colors.darkgrey
                          : colors.black,
                    },
                  ]}
                  source={icons.next}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={filterStyles.chipContainer}>
            <TouchableOpacity
              ref={sortRef}
              style={filterStyles.chip}
              onPress={() => {
                if (dropdownStatus === 'sort') {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  setDropdownStatus('sort');
                  handleMeasure(sortRef);
                }
              }}>
              <Text
                style={[
                  filterStyles.text,
                  {
                    color:
                      dropdownStatus === 'sort'
                        ? colors.darkgrey
                        : colors.black,
                  },
                ]}>
                {strings.filter.sortby + ': ' + misc.libraryFilter.sort[sort]}
              </Text>
              <View style={filterStyles.drop}>
                <Image
                  style={[
                    filterStyles.icon,
                    {
                      tintColor:
                        dropdownStatus === 'sort'
                          ? colors.darkgrey
                          : colors.black,
                    },
                  ]}
                  source={icons.next}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity
            style={filterStyles.button}
            onPress={() => {
              closeDropdown();
            }}>
            <Image style={filterStyles.icon} source={icons.filter} />
          </TouchableOpacity>
        </View>
        {dropdownStatus === 'radius' && width !== 0 && pos !== 0 && (
          <View style={[dropdownStyles.content, {left: pos, width: width}]}>
            {misc.libraryFilter.radius.map((option, idx) => (
              <View key={idx}>
                <TouchableOpacity
                  style={dropdownStyles.option}
                  onPress={() => handleRadiusOptionPress(idx)}>
                  <Text style={dropdownStyles.text}>
                    {option + ' ' + strings.createTabStack.milesAbbrev}
                  </Text>
                  {idx === radius && (
                    <Image style={dropdownStyles.check} source={icons.tick} />
                  )}
                </TouchableOpacity>
                {!misc.libraryFilter.radius?.length ||
                  (idx < misc.libraryFilter.radius?.length - 1 && (
                    <View style={dropdownStyles.separator} />
                  ))}
              </View>
            ))}
          </View>
        )}
        {dropdownStatus === 'sort' && width !== 0 && pos !== 0 && (
          <View style={[dropdownStyles.content, {left: pos, width: width}]}>
            {misc.libraryFilter.sort.map((option, idx) => (
              <View key={idx}>
                <TouchableOpacity
                  style={dropdownStyles.option}
                  onPress={() => handleSortOptionPress(idx)}>
                  <Text style={dropdownStyles.text}>{option}</Text>
                  {idx === sort && (
                    <Image style={dropdownStyles.check} source={icons.tick} />
                  )}
                </TouchableOpacity>
                {!misc.libraryFilter.radius?.length ||
                  (idx < misc.libraryFilter.sort?.length - 1 && (
                    <View style={dropdownStyles.separator} />
                  ))}
              </View>
            ))}
          </View>
        )}
      </View>
      <FlatList
        data={TempData}
        initialNumToRender={4}
        keyExtractor={(item: any) => item?.id}
        ItemSeparatorComponent={Spacer}
        onTouchStart={() => closeDropdown()}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
            style={styles.card}
              onPress={() => {
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
    marginHorizontal: s(20),
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
    width: s(280),
  }
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    marginBottom: s(10),
  },
  title: {
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
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

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    zIndex: 1,
  },
  scrollView: {
    overflow: 'visible',
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
    paddingBottom: s(10),
    overflow: 'visible',
  },
  chipContainer: {
    marginRight: s(5),
  },
  chip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.darkgrey,
    borderRadius: s(15),
    paddingHorizontal: s(11),
    paddingVertical: s(5),
    height: s(25),
  },
  text: {
    fontSize: s(11),
    fontWeight: '500',
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(5),
    width: s(9),
    height: s(6),
  },
  icon: {
    width: s(6),
    height: s(9),
    transform: [{rotate: '90deg'}],
  },
  button: {
    width: s(20),
    height: s(20),
  },
  filter: {
    width: '70%',
    height: '70%',
    tintColor: colors.accent,
  }
});

const dropdownStyles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: s(25),
    borderRadius: s(10),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: s(10),
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: '#ccc',
    backgroundColor: colors.white,
  },
  text: {
    fontSize: s(11),
    fontWeight: '500',
    color: colors.black,
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.grey,
  },
  check: {
    width: s(12),
    height: s(12),
    tintColor: colors.accent,
  },
});

export default AddFromLibrary;
