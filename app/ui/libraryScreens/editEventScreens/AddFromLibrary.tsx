import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import EncryptedStorage from 'react-native-encrypted-storage';

import PlaceCard from '../../components/PlaceCard';
import {getBookmarks} from '../../../utils/api/shared/getBookmarks';

import {genres} from '../../../constants/genres';
import {icons} from '../../../constants/images';
import strings from '../../../constants/strings';
import misc from '../../../constants/misc';
import {colors} from '../../../constants/theme';

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

const AddFromLibrary = ({onClose, onSelect}: {onClose: any; onSelect: any}) => {
  const [_, setPlaces] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const bookmarks = await getBookmarks(authToken);
      setPlaces(bookmarks);
    };

    initializeData();
  }, []);

  const [dropdownStatus, setDropdownStatus]: [any, any] = useState('');
  const [filters, setFilters]: [number[], any] = useState([0, 0]);
  const [tempFilters, setTempFilters]: [number[], any] = useState([0, 0]);
  const [categoryFilter, setCategoryFilter]: [number[], any] = useState([]);
  const [tempCategoryFilter, setTempCategoryFilter]: [number[], any] = useState(
    [],
  );
  const refs: any = [React.useRef(null), React.useRef(null)];
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

  const handleOptionPress = (idx: number, option: number) => {
    let newFilters = filters;
    newFilters[idx] = option;
    setFilters(newFilters);
    closeDropdown();
  };

  const handleTempOptionPress = (idx: number, option: number) => {
    setTempFilters([
      ...tempFilters.slice(0, idx),
      option,
      ...tempFilters.slice(idx + 1),
    ]);
  };

  const closeDropdown = () => {
    setDropdownStatus('');
    setPos(0);
    setWidth(0);
  };

  const [modalVisible, setModalVisible] = useState(false);

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
          style={filterStyles.scrollView}
          contentContainerStyle={filterStyles.contentContainer}
          showsHorizontalScrollIndicator={false}>
          {misc?.libraryFilter?.map((item: any, index: any) => (
            <TouchableOpacity
              key={index}
              ref={refs[index]}
              style={[filterStyles.chip, filterStyles.chipContainer]}
              onPress={() => {
                if (dropdownStatus === item.name) {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  setDropdownStatus(item.name);
                  handleMeasure(refs[index]);
                }
              }}>
              <Text
                style={[
                  filterStyles.text,
                  {
                    color:
                      dropdownStatus === item.name
                        ? colors.darkgrey
                        : colors.black,
                  },
                ]}>
                {item.text + ': ' + item.options[filters[index]]}
              </Text>
              <View style={filterStyles.drop}>
                <Image
                  style={[
                    filterStyles.dropIcon,
                    {
                      tintColor:
                        dropdownStatus === item.name
                          ? colors.darkgrey
                          : colors.black,
                    },
                  ]}
                  source={icons.next}
                />
              </View>
            </TouchableOpacity>
          ))}
          {categoryFilter.length > 0 && (
            <View style={filterStyles.chipContainer}>
              <View
                style={[filterStyles.chip, {backgroundColor: colors.accent}]}>
                <Text style={filterStyles.text}>
                  {/* TODO: Display actual category name */}
                  {categoryFilter[0] +
                    (categoryFilter.length > 1
                      ? ' +' + (categoryFilter.length - 1)
                      : '')}
                </Text>
                <TouchableOpacity
                  style={filterStyles.x}
                  onPress={() => {
                    setCategoryFilter([]);
                  }}>
                  <Image style={filterStyles.xIcon} source={icons.x} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
        <View>
          <View style={filterStyles.filterContainer}>
            <TouchableOpacity
              style={filterStyles.button}
              onPress={() => {
                closeDropdown();
                setModalVisible(true);
                setTempFilters(filters);
                setTempCategoryFilter(categoryFilter);
              }}>
              <Image style={filterStyles.filter} source={icons.filter} />
            </TouchableOpacity>
          </View>
        </View>
        {misc.libraryFilter?.map((item: any, index: any) =>
          dropdownStatus === item.name && width !== 0 && pos !== 0 ? (
            <View
              style={[dropdownStyles.content, {left: pos, width: width}]}
              key={index}>
              {item.options.map((option: any, idx: any) => (
                <View key={idx}>
                  <TouchableOpacity
                    style={dropdownStyles.option}
                    onPress={() => handleOptionPress(index, idx)}>
                    <Text style={dropdownStyles.text}>{option}</Text>
                    {idx === filters[index] && (
                      <Image style={dropdownStyles.check} source={icons.tick} />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null,
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
                onSelect();
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

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={modalStyles.container}>
          <Pressable
            style={styles.dim}
            onPress={() => {
              setModalVisible(false);
            }}
          />
          <View style={modalStyles.modal}>
            <View style={modalStyles.header}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={modalStyles.x}>
                <Image style={modalStyles.icon} source={icons.x} />
              </TouchableOpacity>
              <Text style={modalStyles.title}>{strings.library.filter}</Text>
            </View>
            <ScrollView
              style={modalStyles.scrollview}
              contentContainerStyle={modalStyles.contentContainer}
              showsVerticalScrollIndicator={false}>
              {misc.libraryFilter.map((filter, index) => (
                <View key={index}>
                  <Text style={modalStyles.textLabel}>
                    {filter?.text + ':'}
                  </Text>
                  <View style={modalStyles.filterContainer}>
                    {filter?.options.map((option, idx) => (
                      <View key={idx} style={modalStyles.chipContainer}>
                        <TouchableOpacity
                          style={filterStyles.chip}
                          onPress={() => {
                            handleTempOptionPress(index, idx);
                          }}>
                          <Text style={dropdownStyles.text}>{option}</Text>
                          {idx === tempFilters[index] && (
                            <Image
                              style={modalStyles.check}
                              source={icons.tick}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
              <Text style={modalStyles.textLabel}>
                {strings.filter.categories + ':'}
              </Text>
              {genres.map((genre, index) => (
                <View key={index}>
                  <Text style={modalStyles.genreLabel}>{genre.name + ':'}</Text>
                  <View style={modalStyles.filterContainer}>
                    {genre.categories.map((category, idx) => (
                      <View key={idx} style={modalStyles.chipContainer}>
                        <TouchableOpacity
                          style={[
                            filterStyles.chip,
                            {
                              backgroundColor: tempCategoryFilter.includes(
                                category.id,
                              )
                                ? colors.accent
                                : colors.white,
                            },
                          ]}
                          onPress={() => {
                            setTempCategoryFilter(
                              tempCategoryFilter.includes(category.id)
                                ? tempCategoryFilter.filter(
                                    item => item !== category.id,
                                  )
                                : [...tempCategoryFilter, category.id],
                            );
                          }}>
                          <Text style={dropdownStyles.text}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={modalStyles.buttons}>
              <TouchableOpacity
                style={modalStyles.clear}
                onPress={() => {
                  setFilters([0, 0]);
                  setCategoryFilter([]);
                  setModalVisible(false);
                }}>
                <Text style={modalStyles.buttonText}>
                  {strings.filter.clear}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.apply}
                onPress={() => {
                  setFilters(tempFilters);
                  setCategoryFilter(tempCategoryFilter);
                  setModalVisible(false);
                }}>
                <Text style={modalStyles.buttonText}>
                  {strings.filter.apply}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '150%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    marginBottom: s(5),
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
    paddingVertical: s(10),
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
    color: colors.black,
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(5),
    width: s(9),
    height: s(6),
  },
  dropIcon: {
    width: s(6),
    height: s(9),
    transform: [{rotate: '90deg'}],
  },
  x: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(25),
    height: s(25),
    marginRight: -s(10),
  },
  xIcon: {
    width: '30%',
    height: '30%',
  },
  filterContainer: {
    width: s(40),
    height: s(40),
    paddingLeft: s(5),
    marginRight: s(5),
    marginTop: s(5),
    paddingBottom: s(5),
    borderLeftWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  filter: {
    width: '60%',
    height: '60%',
    tintColor: colors.accent,
  },
});

const dropdownStyles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: s(35),
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

const modalStyles = StyleSheet.create({
  container: {
    paddingTop: vs(120),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingBottom: s(10),
  },
  modal: {
    alignSelf: 'center',
    width: s(310),
    maxHeight: vs(500),
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.white,

    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    backgroundColor: colors.grey,
    borderTopLeftRadius: s(8),
    borderTopRightRadius: s(8),
  },
  title: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
  },
  x: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -s(12),
    right: -s(12),
    width: s(25),
    height: s(25),
    backgroundColor: colors.grey,
    borderRadius: s(12.5),
    borderWidth: 1,
    borderColor: colors.darkgrey,
  },
  icon: {
    width: '40%',
    height: '40%',
    tintColor: colors.black,
  },
  scrollview: {
    paddingHorizontal: s(20),
  },
  textLabel: {
    marginTop: s(15),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.black,
  },
  genreLabel: {
    marginTop: s(15),
    marginLeft: s(5),
    fontSize: s(13),
    fontWeight: '600',
    color: colors.black,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: s(5),
    paddingBottom: s(0),
  },
  chipContainer: {
    marginTop: s(5),
    marginRight: s(5),
  },
  check: {
    marginLeft: s(6),
    width: s(12),
    height: s(12),
    tintColor: colors.accent,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: s(40),
  },
  clear: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    backgroundColor: colors.darkgrey,
    borderBottomLeftRadius: s(10),
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.grey,
  },
  apply: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    backgroundColor: colors.accent,
    borderBottomRightRadius: s(10),
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.grey,
  },
  buttonText: {
    fontSize: s(14),
    fontWeight: '700',
    color: colors.white,
  },
});

export default AddFromLibrary;
