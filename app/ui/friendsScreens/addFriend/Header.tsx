import React, {createRef} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {searchUsers} from '../../../utils/api/friendsAPI';
import {UserInfo} from '../../../utils/types';

interface Props {
  navigation: any;
  searching: boolean;
  setSearching: (searching: boolean) => void;
  setLoading: (loading: boolean) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  setSearchResults: (searchResults: UserInfo[]) => void;
}

const Header: React.FC<Props> = ({
  navigation,
  searching,
  setSearching,
  setLoading,
  searchText,
  setSearchText,
  setSearchResults,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const searchRef = createRef<TextInput>();

  const search = async (text: string) => {
    setLoading(true);
    setSearchText(text);
    if (text.length > 0) {
      const result = await searchUsers(text);

      if (result) {
        setSearchResults(result);
      } else {
        Alert.alert(strings.error.error, strings.error.searchError);
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon icon={icons.close} onPress={() => navigation.goBack()} />
        <View style={[styles.searchBar, STYLES.shadow]}>
          <Icon size="s" icon={icons.search} />
          <TextInput
            ref={searchRef}
            style={styles.searchText}
            value={searchText}
            placeholder={strings.search.search}
            placeholderTextColor={colors[theme].neutral}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setSearching(true);
            }}
            onBlur={() => setSearching(false)}
            onChangeText={text => search(text)}
            clearButtonMode="while-editing"
          />
        </View>
        {searching ? (
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => {
              searchRef.current?.blur();
              searchRef.current?.clear();
              setSearching(false);
              setSearchText('');
              setSearchResults([]);
            }}>
            <Text>{strings.main.cancel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors[theme].primary,
      borderRadius: s(10),
      marginLeft: s(10),
      paddingHorizontal: s(10),
      paddingVertical: s(5),
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

export default Header;
