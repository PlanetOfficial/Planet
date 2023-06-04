import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';

import {s} from 'react-native-size-matters';

import {icons} from '../../constants/icons';
import {colors} from '../../constants/colors';
import strings from '../../constants/strings';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {Filter as FilterT} from '../../utils/interfaces/types';

interface ChildComponentProps {
  filters: FilterT[];
  currFilters: (number | number[])[];
  setCurrFilters: (filters: (number | number[])[]) => void;
}

const Filter = forwardRef((props: ChildComponentProps, ref) => {
  const {filters, currFilters, setCurrFilters} = props;

  useImperativeHandle(ref, () => ({
    closeDropdown,
  }));

  const [dropdownStatus, setDropdownStatus] = useState<string>('');

  const refs = useRef(new Map());

  const [pos, setPos] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const handleMeasure = (r: {
    measureInWindow: (arg0: (x: number, _y: number, w: number) => void) => void;
  }) => {
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
      newFilters[idx] = newFilters[idx] === option ? -1 : option;
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
      if (_filter.length === 0) {
        return '';
      } else {
        return ` (${_filter.length})`;
      }
    } else {
      if (_filter === -1) {
        return ': ' + strings.filter.none;
      }
      return ': ' + filter.options[_filter];
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
                dropdownStatus === filter.name ? colors.darkgrey : colors.black
              }>
              {filter.name + displayFilter(filter, idx)}
            </Text>
            <View style={styles.chipIcon}>
              <Icon icon={icons.drop} padding={s(3)} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {filters.map((filter: FilterT, index: number) =>
        dropdownStatus === filter.name && width !== 0 && pos !== 0 ? (
          <View
            key={index}
            style={[styles.optionContainer, {left: pos, minWidth: width}]}>
            {filter.options.map((option: string, idx: number) => (
              <View key={idx}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    handleOptionPress(index, idx, currFilters, setCurrFilters);
                    if (!Array.isArray(currFilters[index])) {
                      closeDropdown();
                    }
                  }}>
                  {idx === currFilters[index] ||
                  isSelected(index, idx, currFilters) ? (
                    <Icon
                      icon={
                        Array.isArray(currFilters[index])
                          ? icons.checked
                          : icons.selected
                      }
                      color={colors.accent}
                    />
                  ) : (
                    <Icon
                      icon={
                        Array.isArray(currFilters[index])
                          ? icons.unchecked
                          : icons.unselected
                      }
                      color={colors.accent}
                    />
                  )}
                  <View style={styles.paddingLeft}>
                    <Text size="xs" weight="l">
                      {option}
                    </Text>
                  </View>
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
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    zIndex: 10,
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
    zIndex: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: s(10),
    padding: s(10),
    borderBottomColor: '#ccc',
    backgroundColor: colors.white,
  },
  paddingLeft: {
    paddingLeft: s(10),
  },
  optionSeparator: {
    height: 0.5,
    backgroundColor: colors.grey,
  },
});

export default Filter;
