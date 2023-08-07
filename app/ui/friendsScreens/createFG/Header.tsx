import React, {createRef} from 'react';
import {
  View,
  Alert,
  useColorScheme,
  LayoutAnimation,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity as TouchableOpacityGestureHandler} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {UserInfo} from '../../../utils/types';
import {search} from './functions';

interface Props {
  navigation: any;
  selectedId: number[];
  setLoading: (loading: boolean) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  searchResults: UserInfo[];
  setSearchResults: (results: UserInfo[]) => void;
  searching: boolean;
  setSearching: (searching: boolean) => void;
  friends: UserInfo[];
}

const Header: React.FC<Props> = ({
  navigation,
  selectedId,
  setLoading,
  searchText,
  setSearchText,
  setSearchResults,
  searching,
  setSearching,
  friends,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const searchRef = createRef<TextInput>();

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon
          icon={icons.close}
          onPress={() => {
            if (selectedId.length > 0) {
              Alert.alert(
                strings.main.warning,
                strings.friends.fgCreateBackConfirmation,
                [
                  {
                    text: strings.main.cancel,
                    style: 'cancel',
                  },
                  {
                    text: strings.main.discard,
                    onPress: () => navigation.goBack(),
                    style: 'destructive',
                  },
                ],
              );
            } else {
              navigation.goBack();
            }
          }}
        />
        <View style={[styles.searchBar, STYLES.shadow]}>
          <Icon size="s" icon={icons.search} />
          <TextInput
            ref={searchRef}
            style={styles.searchText}
            value={searchText}
            placeholder={strings.search.searchFriends}
            placeholderTextColor={colors[theme].neutral}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setSearching(true);
            }}
            onChangeText={text =>
              search(text, setLoading, setSearchText, setSearchResults, friends)
            }
            clearButtonMode="while-editing"
          />
        </View>
        {searching ? (
          <TouchableOpacityGestureHandler
            style={styles.cancel}
            onPress={() => {
              searchRef.current?.blur();
              searchRef.current?.clear();
              setSearching(false);
              setSearchText('');
              setSearchResults([]);
            }}>
            <Text>{strings.main.cancel}</Text>
          </TouchableOpacityGestureHandler>
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
