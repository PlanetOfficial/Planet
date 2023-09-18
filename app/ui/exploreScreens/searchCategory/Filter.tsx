import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import icons from '../../../constants/icons';
import colors from '../../../constants/colors';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Filter} from '../../../utils/types';

interface ChildComponentProps {
  filters: Filter[];
  currFilters: (number | number[])[];
  setCurrFilters: (filters: (number | number[])[]) => void;
}

const Filters = forwardRef((props: ChildComponentProps, ref) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

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

  const displayFilter = (filter: Filter, index: number): string => {
    const _filter: number | number[] = currFilters[index];
    if (Array.isArray(_filter)) {
      if (_filter.length === 0) {
        return '';
      } else {
        return ` (${_filter.length})`;
      }
    } else {
      if (_filter === -1 || filter.options.length === 1) {
        return '';
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
        horizontal={true}
        contentContainerStyle={styles.contentContainer}
        onScrollBeginDrag={() => closeDropdown()}
        showsHorizontalScrollIndicator={false}>
        {filters.map((filter: Filter, idx: number) => {
          const currFilter = currFilters[idx];
          return (
            <TouchableOpacity
              key={idx}
              ref={r => refs.current.set(idx, r)}
              style={[
                styles.chip,
                styles.chipContainer,
                currFilter === -1 ||
                (Array.isArray(currFilter) && currFilter.length === 0)
                  ? {backgroundColor: colors[theme].primary}
                  : {backgroundColor: colors[theme].accent},
              ]}
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
                  if (filter.options.length === 1) {
                    handleOptionPress(idx, 0, currFilters, setCurrFilters);
                  } else {
                    setDropdownStatus(filter.name);
                  }
                  handleMeasure(refs.current.get(idx));
                }
              }}>
              <Text
                size="xs"
                weight="l"
                color={
                  dropdownStatus === filter.name
                    ? colors[theme].neutral
                    : colors[theme].neutral
                }>
                {filter.name + displayFilter(filter, idx)}
              </Text>
              {filter.options.length > 1 ? (
                <View style={styles.chipIcon}>
                  <Icon icon={icons.drop} padding={s(3)} />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {filters.map((filter: Filter, index: number) =>
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
                      color={colors[theme].accent}
                    />
                  ) : (
                    <Icon
                      icon={
                        Array.isArray(currFilters[index])
                          ? icons.unchecked
                          : icons.unselected
                      }
                      color={colors[theme].accent}
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

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: colors[theme].secondary,
      zIndex: 10,
      marginBottom: s(5),
    },
    contentContainer: {
      paddingLeft: s(20),
      paddingRight: s(5),
      paddingVertical: s(10),
    },
    chipContainer: {
      marginRight: s(8),
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      height: s(25),
      paddingHorizontal: s(10),

      borderRadius: s(12.5),
      borderWidth: 0.4,
      borderColor: colors[theme].neutral,
    },
    chipIcon: {
      marginLeft: s(3),
      marginRight: -s(3),
    },
    optionContainer: {
      position: 'absolute',
      top: s(35),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
      shadowColor: colors[theme].black,
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
      borderBottomColor: colors[theme].secondary,
      backgroundColor: colors[theme].primary,
    },
    paddingLeft: {
      paddingLeft: s(10),
    },
    optionSeparator: {
      height: 1,
      backgroundColor: colors[theme].secondary,
    },
  });

export default Filters;
