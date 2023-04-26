import React, {useState, forwardRef, useImperativeHandle } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import PlaceCard from '../components/PlaceCard';
import ScrollIndicator from '../components/ScrollIndicator';

import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import strings from '../../constants/strings';

interface ChildComponentProps {
  navigation: any;
  category: any;
  fullEventData: any;
  bookmarks: any;
  categoryIndex: number;
  tempPlaces: any;
  onCategoryMove: any;
}

const Category = forwardRef((props: ChildComponentProps, ref) => {
  const {
    navigation,
    category,
    fullEventData,
    bookmarks,
    categoryIndex,
    tempPlaces,
    onCategoryMove,
  } = props;

  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  const [placeIdx, setPlaceIdx] = useState(0);

  const [optionDropDownOpen, setOptionDropDownOpen] = useState(false);
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

  const [modalVisible, setModalVisible] = useState(false);

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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOptionDropDownOpen(false);
    setDropdownStatus('');
    setPos(0);
    setWidth(0);
  };

  return (
    <View style={categoryStyles.container} key={category.id}>
      <View style={categoryStyles.categoryHeader}>
        <View style={categoryStyles.categoryIconContainer}>
          <Image style={categoryStyles.categoryIcon} source={category.icon} />
        </View>
        <Text style={categoryStyles.categoryTitle}>{category.name}</Text>
        <TouchableOpacity
          style={categoryStyles.option}
          onPress={() => {
            if (dropdownStatus !== '') {
              closeDropdown();
            }
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setOptionDropDownOpen(!optionDropDownOpen);
          }}>
          <Image style={categoryStyles.optionIcon} source={icons.option} />
        </TouchableOpacity>
      </View>
      <View style={filterStyles.container}>
        <ScrollView
          onScrollBeginDrag={() => closeDropdown()}
          horizontal={true}
          style={filterStyles.scrollView}
          contentContainerStyle={filterStyles.contentContainer}
          showsHorizontalScrollIndicator={false}>
          {category.filters?.map((item: any, index: any) => (
            <TouchableOpacity
              key={index}
              ref={refs[index]}
              style={[filterStyles.chip, filterStyles.chipContainer]}
              onPress={() => {
                setOptionDropDownOpen(false);
                if (dropdownStatus === item.name) {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
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
                  {category.subcategories[categoryFilter[0] - 1].name +
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
        {category.filters?.map((item: any, index: any) =>
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
        {optionDropDownOpen ? (
          <View style={dropdownStyles.optionContent}>
            <TouchableOpacity
              style={dropdownStyles.option}
              disabled={categoryIndex === 0}
              onPress={() => onCategoryMove(categoryIndex, -1)}>
              <Text
                style={[
                  dropdownStyles.text,
                  categoryIndex === 0 && {color: colors.darkgrey},
                ]}>
                {strings.createTabStack.moveUp}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dropdownStyles.option}
              disabled={categoryIndex === tempPlaces.length - 1}
              onPress={() => onCategoryMove(categoryIndex, 1)}>
              <Text
                style={[
                  dropdownStyles.text,
                  categoryIndex === tempPlaces.length - 1 && {
                    color: colors.darkgrey,
                  },
                ]}>
                {strings.createTabStack.moveDown}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dropdownStyles.option}
              disabled={tempPlaces.length === 1}
              onPress={() => onCategoryMove(categoryIndex, 0)}>
              <Text
                style={[
                  dropdownStyles.text,
                  {
                    color:
                      tempPlaces.length === 1 ? colors.darkgrey : colors.red,
                  },
                ]}>
                {strings.createTabStack.remove}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <ScrollView
        style={categoryStyles.scrollView}
        contentContainerStyle={categoryStyles.contentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        scrollEventThrottle={16}
        snapToInterval={s(300)} // 280 + 20
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        onScroll={event => {
          closeDropdown();
          setPlaceIdx(Math.round(event.nativeEvent.contentOffset.x / s(300)));
        }}>
        {fullEventData?.places.map((dest: any, index: number) => (
          <View
            style={[
              categoryStyles.card,
              index !== fullEventData?.places.length - 1 && {
                marginRight: s(20),
              },
            ]}
            key={dest.id}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Place', {
                  destination: dest,
                  category: dest?.category?.name,
                });
              }}>
              <PlaceCard
                id={dest?.id}
                name={dest?.name}
                info={dest?.category?.name}
                marked={bookmarks?.includes(dest?.id)}
                image={
                  dest?.image_url
                    ? {
                        uri: dest?.image_url,
                      }
                    : icons.defaultIcon
                }
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <ScrollIndicator num={fullEventData?.places?.length} idx={placeIdx} />

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
              {category.filters?.map((filter: any, index: number) => (
                <View key={index}>
                  <Text style={modalStyles.textLabel}>
                    {filter?.text + ':'}
                  </Text>
                  <View style={modalStyles.filterContainer}>
                    {filter?.options.map((option: any, idx: number) => (
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
              <View style={modalStyles.filterContainer}>
                {category.subcategories?.map((item: any, index: any) => (
                  <View key={index} style={modalStyles.chipContainer}>
                    <TouchableOpacity
                      style={[
                        filterStyles.chip,
                        {
                          backgroundColor: tempCategoryFilter.includes(item.id)
                            ? colors.accent
                            : colors.white,
                        },
                      ]}
                      onPress={() => {
                        setTempCategoryFilter(
                          tempCategoryFilter.includes(item.id)
                            ? tempCategoryFilter.filter(
                                (i: any) => i !== item.id,
                              )
                            : [...tempCategoryFilter, item.id],
                        );
                      }}>
                      <Text style={dropdownStyles.text}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
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
});

const styles = StyleSheet.create({
  dim: {
    position: 'absolute',
    width: '100%',
    height: '150%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    width: s(350),
    paddingBottom: s(5),
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
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
  categoryTitle: {
    width: s(240),
    marginLeft: s(10),
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(25),
    height: s(25),
  },
  optionIcon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  scrollView: {
    marginTop: s(10),
    overflow: 'visible', // display shadow
  },
  contentContainer: {
    paddingHorizontal: s(35),
  },
  card: {
    width: s(280), // height: 280 * 5/8 = 175
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
  optionContent: {
    position: 'absolute',
    top: s(-5),
    right: s(20),
    width: s(100),
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

export default Category;
