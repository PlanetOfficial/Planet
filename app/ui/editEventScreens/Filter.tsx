import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  LayoutAnimation,
} from 'react-native';

import {s} from 'react-native-size-matters';

import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import strings from '../../constants/strings';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {Filter as FilterT, Subcategory} from '../../utils/interfaces/types';

interface ChildComponentProps {
  filters: FilterT[];
  currFilters: (number | number[])[];
  setCurrFilters: (filters: (number | number[])[]) => void;
  defaultFilterValues: (number | number[])[];
  subcategories?: Subcategory[];
  categoryFilter?: number[];
  setCategoryFilter?: (categoryFilter: number[]) => void;
}

const Filter = forwardRef((props: ChildComponentProps, ref) => {
  const {
    filters,
    subcategories,
    currFilters,
    setCurrFilters,
    defaultFilterValues,
    categoryFilter,
    setCategoryFilter,
  } = props;

  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  const [dropdownStatus, setDropdownStatus] = useState<string>('');

  const [tempFilters, setTempFilters] = useState<(number | number[])[]>(
    Array(filters.length).fill(0),
  );
  const [tempCategoryFilter, setTempCategoryFilter] = useState<number[]>([]);

  const refs = useRef(new Map());

  const [pos, setPos] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleMeasure = (r: any) => {
    r.measureInWindow((x: number, _y: number, w: number) => {
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

  const handleOptionPress = (
    idx: number,
    option: number,
    _filters: (number | number[])[],
    setFilters: (filters: (number | number[])[]) => void,
  ) => {
    let newFilters = [..._filters];
    let _option: number | number[] = newFilters[idx];
    if (Array.isArray(_option)) {
      if (_option.includes(option)) {
        newFilters[idx] = _option.filter((i: number) => i !== option);
      } else {
        newFilters[idx] = [..._option, option];
      }
    } else {
      newFilters[idx] = option;
    }
    setFilters(newFilters);
  };

  const closeDropdown = () => {
    setDropdownStatus('');
    setPos(0);
    setWidth(0);
  };

  const displayFilter = (filter: FilterT, index: number): string => {
    const _filter: number | number[] = currFilters[index];
    if (Array.isArray(_filter)) {
      if (_filter.length === filter.options.length || _filter.length === 0) {
        return strings.filter.all;
      } else {
        return _filter
          .sort()
          .map((i: number) => filter.options[i])
          .join(', ');
      }
    } else {
      return filter.options[_filter];
    }
  };

  const displaySubcategory = (): string => {
    if (!subcategories || !categoryFilter || categoryFilter.length === 0) {
      return '';
    }
    if (categoryFilter.length === subcategories.length) {
      return strings.filter.all + ' ' + strings.filter.categories;
    } else if (categoryFilter.length > 2) {
      return (
        subcategories[categoryFilter[0]].title +
        ', ' +
        subcategories[categoryFilter[1]].title +
        ' +' +
        (categoryFilter.length - 2)
      );
    } else if (categoryFilter.length > 1) {
      return (
        subcategories[categoryFilter[0]].title +
        ', ' +
        subcategories[categoryFilter[1]].title
      );
    } else {
      return subcategories[categoryFilter[0]].title;
    }
  };

  const isSelected = (
    fiterIdx: number,
    idx: number,
    _filters: (number | number[])[],
  ): boolean => {
    const _filter: number | number[] = _filters[fiterIdx];
    return Array.isArray(_filter) && _filter.includes(idx);
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          onScrollBeginDrag={() => closeDropdown()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {filters.map((filter: FilterT, idx: number) => (
            <TouchableOpacity
              key={idx}
              ref={r => refs.current.set(idx, r)}
              style={[styles.chip, styles.chipContainer]}
              onPress={() => {
                if (dropdownStatus === filter.name) {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setDropdownStatus(filter.name);
                  handleMeasure(refs.current.get(idx));
                }
              }}>
              <Text
                size="xs"
                weight="l"
                color={
                  dropdownStatus === filter.name
                    ? colors.darkgrey
                    : colors.black
                }>
                {filter.text + ': ' + displayFilter(filter, idx)}
              </Text>
              <View style={styles.chipIcon}>
                <Icon size="s" icon={icons.drop} padding={s(3)} />
              </View>
            </TouchableOpacity>
          ))}
          {subcategories && categoryFilter && categoryFilter.length > 0 ? (
            <View style={styles.chipContainer}>
              <View style={styles.chip}>
                <Text size="xs" weight="l">
                  {displaySubcategory()}
                </Text>
                <View style={styles.chipIcon}>
                  <Icon
                    size="s"
                    icon={icons.x}
                    padding={s(4)}
                    onPress={() =>
                      setCategoryFilter ? setCategoryFilter([]) : null
                    }
                  />
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
        <View style={styles.filterContainer}>
          <Icon
            size="m"
            icon={icons.filter}
            color={colors.accent}
            onPress={() => {
              closeDropdown();
              setModalVisible(true);
              setTempFilters(currFilters);
              setTempCategoryFilter(categoryFilter ? categoryFilter : []);
            }}
          />
        </View>
        {filters.map((filter: FilterT, index: number) =>
          dropdownStatus === filter.name && width !== 0 && pos !== 0 ? (
            <View
              key={index}
              style={[styles.optionContainer, {left: pos, width: width}]}>
              {filter.options.map((option: string, idx: number) => (
                <View key={idx}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      handleOptionPress(
                        index,
                        idx,
                        currFilters,
                        setCurrFilters,
                      );
                      closeDropdown();
                    }}>
                    <Text size="xs" weight="l">
                      {option}
                    </Text>
                    {idx === currFilters[index] ||
                    isSelected(index, idx, currFilters) ? (
                      <Icon
                        size="xs"
                        icon={icons.confirm}
                        color={colors.accent}
                      />
                    ) : null}
                  </TouchableOpacity>
                  {idx !== filter.options.length - 1 ? (
                    <View style={styles.optionSeparator} />
                  ) : null}
                </View>
              ))}
            </View>
          ) : null,
        )}
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={modalStyles.vertCenter}>
          <Pressable
            style={modalStyles.dim}
            onPress={() => {
              setModalVisible(false);
            }}
          />
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text weight="b">{strings.library.filter}</Text>
            </View>
            <ScrollView
              contentContainerStyle={modalStyles.contentContainer}
              showsVerticalScrollIndicator={false}>
              {filters.map((filter: FilterT, index: number) => (
                <View key={index} style={modalStyles.filter}>
                  <Text size="s" weight="l">
                    {filter.text + ':'}
                  </Text>
                  <View style={modalStyles.filterContainer}>
                    {filter.options.map((option: string, idx: number) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.chip, modalStyles.chip]}
                        onPress={() => {
                          handleOptionPress(
                            index,
                            idx,
                            tempFilters,
                            setTempFilters,
                          );
                        }}>
                        <Text size="xs" weight="l">
                          {option}
                        </Text>
                        {idx === tempFilters[index] ||
                        isSelected(index, idx, tempFilters) ? (
                          <View style={styles.chipIcon}>
                            <Icon
                              size="xs"
                              icon={icons.confirm}
                              color={colors.accent}
                            />
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
              {subcategories ? (
                <View style={modalStyles.filter}>
                  <Text size="s" weight="l">
                    {strings.filter.filterCategories + ':'}
                  </Text>
                  <View style={modalStyles.filterContainer}>
                    {subcategories.map(
                      (subcategory: Subcategory, index: number) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.chip,
                            modalStyles.chip,
                            {
                              backgroundColor: tempCategoryFilter.includes(
                                index,
                              )
                                ? colors.accent
                                : colors.white,
                            },
                          ]}
                          onPress={() => {
                            setTempCategoryFilter(
                              tempCategoryFilter.includes(index)
                                ? tempCategoryFilter.filter(
                                    (i: number) => i !== index,
                                  )
                                : [...tempCategoryFilter, index],
                            );
                          }}>
                          <Text size="xs" weight="l">
                            {subcategory.title}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
              ) : null}
            </ScrollView>
            <View style={modalStyles.buttons}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.clear]}
                onPress={() => {
                  setCurrFilters(defaultFilterValues);
                  setCategoryFilter ? setCategoryFilter([]) : null;
                  setModalVisible(false);
                }}>
                <Text size="s" color={colors.white}>
                  {strings.filter.clear}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.apply]}
                onPress={() => {
                  setCurrFilters(tempFilters);
                  setCategoryFilter
                    ? setCategoryFilter(tempCategoryFilter)
                    : null;
                  setModalVisible(false);
                }}>
                <Text size="s" color={colors.white}>
                  {strings.filter.apply}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    zIndex: 1,
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
    paddingVertical: s(10),
  },
  chipContainer: {
    marginRight: s(5),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: s(25),
    paddingHorizontal: s(10),
    paddingVertical: s(5),

    borderRadius: s(12.5),
    borderWidth: 0.5,
    borderColor: colors.darkgrey,
  },
  chipIcon: {
    marginLeft: s(5),
    marginRight: -s(1),
  },
  filterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(40),
    height: s(40),

    paddingLeft: s(5),
    marginRight: s(5),
    marginTop: s(5),
    paddingBottom: s(5),

    borderLeftWidth: 1,
    borderColor: colors.grey,
  },
  optionContainer: {
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
  optionSeparator: {
    height: 0.5,
    backgroundColor: colors.grey,
  },
});

const modalStyles = StyleSheet.create({
  vertCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: s(20),
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: colors.white,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: s(40),
    borderTopLeftRadius: s(8),
    borderTopRightRadius: s(8),
    backgroundColor: colors.grey,
  },
  contentContainer: {
    paddingBottom: s(10),
    paddingHorizontal: s(20),
  },
  filter: {
    marginTop: s(5),
    marginBottom: s(10),
  },
  chip: {
    marginRight: s(5),
    marginBottom: s(5),
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: s(5),
    paddingBottom: s(0),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: s(40),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    borderTopWidth: 1,
    borderColor: colors.grey,
  },
  clear: {
    backgroundColor: colors.darkgrey,
    borderBottomLeftRadius: s(10),
    borderRightWidth: 1,
  },
  apply: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: s(10),
    borderLeftWidth: 1,
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Filter;
