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

import {UserInfo} from '../../../utils/types';
import {search} from '../friends/functions';
import {useFriendsContext} from '../../../context/FriendsContext';

interface Props {
  navigation: any;
  isEvent: boolean;
  invitees: UserInfo[];
  searching: boolean;
  setSearching: (searching: boolean) => void;
  setLoading: (loading: boolean) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  setSearchResults: (searchResults: UserInfo[]) => void;
  selfUserId: number;
}

const Header: React.FC<Props> = ({
  navigation,
  isEvent,
  invitees,
  searching,
  setSearching,
  setLoading,
  searchText,
  setSearchText,
  setSearchResults,
  selfUserId,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const searchRef = createRef<TextInput>();

  const {usersBlockingMe} = useFriendsContext();

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        {isEvent ? (
          <View style={styles.x}>
            <Icon
              icon={icons.close}
              onPress={() => {
                if (invitees.length > 0) {
                  Alert.alert(
                    strings.main.warning,
                    strings.friends.inviteFriendsBackConfirmation,
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
          </View>
        ) : null}
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
            onChangeText={text =>
              search(
                text,
                setLoading,
                setSearchText,
                setSearchResults,
                selfUserId,
                usersBlockingMe,
              )
            }
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
    x: {
      marginRight: s(10),
    },
  });

export default Header;
