import React, {useState, createRef, useEffect, useContext} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  LayoutAnimation,
  useColorScheme,
  StatusBar,
  SectionList,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';
import EncryptedStorage from 'react-native-encrypted-storage';

import FriendsNavBar from '../../navigations/FriendsNavBar';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';
import UserRow from '../../components/UserRow';

import {UserInfo} from '../../../utils/types';

import ActionButtons from '../user/ActionButtons';
import {search} from './functions';
import { useFriendsContext } from '../../../context/FriendsState';

const Friends = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [selfUserId, setSelfUserId] = useState<number>(0);

  const searchRef = createRef<TextInput>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {friends, usersBlockingMe} = useFriendsContext();

  const loadSelf = async () => {
    const myUserId = await EncryptedStorage.getItem('user_id');
    if (myUserId) {
      setSelfUserId(parseInt(myUserId, 10));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      searchRef.current?.clear();
      loadSelf();
    });

    return unsubscribe;
  }, [navigation, searchRef]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
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
      {searching ? (
        loading ? (
          <View style={[STYLES.center, STYLES.container]}>
            <ActivityIndicator size="small" color={colors[theme].accent} />
          </View>
        ) : (
          <SectionList
            sections={
              searchResults.length > 0
                ? [
                    {
                      title: strings.friends.friends,
                      data: searchResults.filter(user =>
                        friends.some(friend => friend.id === user.id),
                      ),
                    },
                    {
                      title: strings.friends.users,
                      data: searchResults.filter(
                        user => !friends.some(friend => friend.id === user.id),
                      ),
                    },
                  ]
                : []
            }
            style={STYLES.container}
            contentContainerStyle={STYLES.flatList}
            initialNumToRender={10}
            keyboardShouldPersistTaps={'always'}
            scrollIndicatorInsets={{right: 1}}
            data={searchResults}
            renderItem={({item}: {item: UserInfo}) => (
              <TouchableOpacity
                onPress={() => navigation.push('User', {user: item})}>
                <UserRow user={item}>
                  <View style={styles.buttons}>
                    <ActionButtons user={item} />
                  </View>
                </UserRow>
              </TouchableOpacity>
            )}
            renderSectionHeader={({section}) =>
              section.data.length > 0 ? (
                <View style={STYLES.sectionHeader}>
                  <Text size="s">{section.title}</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              searchText.length > 0 ? (
                <View style={STYLES.center}>
                  <Text>{strings.search.noResultsFound}</Text>
                </View>
              ) : null
            }
            keyExtractor={user => user.id.toString()}
          />
        )
      ) : (
        <FriendsNavBar />
      )}
    </View>
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
    buttons: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginBottom: s(10),
      marginRight: -s(10),
    },
  });

export default Friends;
