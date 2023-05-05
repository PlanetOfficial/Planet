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
  subcategories?: Subcategory[];
  currFilters: (number | number[])[];
  setCurrFilters: (filters: (number | number[])[]) => void;
  defaultFilterValues: (number | number[])[];
}

const Filter = forwardRef((props: ChildComponentProps, ref) => {
  const {
    filters,
    subcategories,
    currFilters,
    setCurrFilters,
    defaultFilterValues,
  } = props;

  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  const [dropdownStatus, setDropdownStatus] = useState<string>('');

  const [tempFilters, setTempFilters] = useState<(number | number[])[]>(
    Array(filters.length).fill(0),
  );
  const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
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

  const handleOptionPress = (idx: number, option: number) => {
    let newFilters = [...currFilters];
    newFilters[idx] = option;
    setCurrFilters(newFilters);
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
    setDropdownStatus('');
    setPos(0);
    setWidth(0);
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
                {filter.text + ': ' + (Array.isArray(currFilters[idx])
                  ? currFilters[idx]  // @ts-ignore
                      .map((i: number) => filter.options[i])
                      .join(', ')     // @ts-ignore
                  : filter.options[currFilters[idx]])}
              </Text>
              <View style={styles.chipIcon}>
                <Icon size="s" icon={icons.drop} padding={s(3)} />
              </View>
            </TouchableOpacity>
          ))}
          {subcategories && categoryFilter.length > 0 ? (
            <View style={styles.chipContainer}>
              <View style={styles.chip}>
                <Text size="xs" weight="l">
                  {subcategories[categoryFilter[0] - 1].title +
                    (categoryFilter.length > 1
                      ? ' +' + (categoryFilter.length - 1)
                      : '')}
                </Text>
                <View style={styles.chipIcon}>
                  <Icon
                    size="s"
                    icon={icons.x}
                    padding={s(4)}
                    onPress={() => setCategoryFilter([])}
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
              setTempCategoryFilter(categoryFilter);
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
                    onPress={() => handleOptionPress(index, idx)}>
                    <Text size="xs" weight="l">
                      {option}
                    </Text>
                    {idx === currFilters[index] ? (
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
                          handleTempOptionPress(index, idx);
                        }}>
                        <Text size="xs" weight="l">
                          {option}
                        </Text>
                        {idx === tempFilters[index] ? (
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
                    {strings.filter.categories + ':'}
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
                                subcategory.id,
                              )
                                ? colors.accent
                                : colors.white,
                            },
                          ]}
                          onPress={() => {
                            setTempCategoryFilter(
                              tempCategoryFilter.includes(subcategory.id)
                                ? tempCategoryFilter.filter(
                                    (i: number) => i !== subcategory.id,
                                  )
                                : [...tempCategoryFilter, subcategory.id],
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
                  setCategoryFilter([]);
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
                  setCategoryFilter(tempCategoryFilter);
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
