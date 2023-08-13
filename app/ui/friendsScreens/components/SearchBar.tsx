import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {UserInfo} from '../../../utils/types';
import { Layout } from 'react-native-reanimated';

interface Props {
  searchRef: any;
  searchText: string;
  setSearchText: (text: string) => void;
  searching: boolean;
  setSearching: (searching: boolean) => void;
  setSearchResults: (results: UserInfo[]) => void;
  search: (text: string) => void;
}

const SearchBar: React.FC<Props> = ({
  searchRef,
  searchText,
  setSearchText,
  searching,
  setSearching,
  setSearchResults,
  search,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, STYLES.shadow]}>
        <Icon size="s" icon={icons.search} color={colors[theme].secondary} />
        <TextInput
          ref={searchRef}
          style={styles.searchText}
          value={searchText}
          placeholder={strings.friends.searchFriends}
          placeholderTextColor={colors[theme].secondary}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSearching(true);
          }}
          onChangeText={search}
          clearButtonMode="while-editing"
        />
      </View>
      {searching ? (
        <TouchableOpacity
          style={styles.cancel}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      borderRadius: s(10),
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
