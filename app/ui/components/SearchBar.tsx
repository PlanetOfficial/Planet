import React, {createRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from './Icon';
import Text from './Text';

interface Props {
  searchText: string;
  setSearchText: (text: string) => void;
  searching: boolean;
  setSearching: (searching: boolean) => void;
  setSearchResults: (results: any[]) => void;
  search: (text: string) => void;
  searchPrompt: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<Props> = ({
  searchText,
  setSearchText,
  searching,
  setSearching,
  setSearchResults,
  search,
  searchPrompt,
  autoFocus = false,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const searchRef = createRef<any>();

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, STYLES.shadow]}>
        <Icon icon={icons.search} color={colors[theme].secondary} />
        <TextInput
          ref={searchRef}
          style={styles.searchText}
          value={searchText}
          autoFocus={autoFocus}
          placeholder={searchPrompt}
          placeholderTextColor={colors[theme].secondary}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => {
            if (Platform.OS === 'ios') {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(
                  200,
                  LayoutAnimation.Types.easeInEaseOut,
                  LayoutAnimation.Properties.opacity,
                ),
              );
            }
            setSearching(true);
          }}
          onChangeText={search}
          clearButtonMode={'while-editing'}
        />
      </View>
      {searching ? (
        <TouchableOpacity
          style={styles.cancel}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.create(
                100,
                LayoutAnimation.Types.easeInEaseOut,
                LayoutAnimation.Properties.opacity,
              ),
            );
            searchRef.current?.blur();
            searchRef.current?.clear();
            setSearching(false);
            setSearchText('');
            setSearchResults([]);
          }}>
          <Text size="s" weight="l">
            {strings.main.cancel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: s(5),
      paddingHorizontal: s(20),
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      height: s(35),
      borderRadius: s(5),
      backgroundColor: colors[theme].primary,
    },
    searchText: {
      flex: 1,
      marginLeft: s(10),
      fontSize: s(13),
      fontFamily: 'Lato',
      padding: 0,
      color: colors[theme].neutral,
    },
    cancel: {
      marginLeft: s(10),
    },
  });

export default SearchBar;
