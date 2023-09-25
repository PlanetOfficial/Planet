import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';
import UserRow from '../../components/UserRow';
import ActionButtons from '../components/ActionButtons';
import SearchResult from '../components/SearchResult';
import SearchBar from '../../components/SearchBar';

import {UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';

import {useFriendsContext} from '../../../context/FriendsContext';

import {search} from './functions';
import FriendsList from './FriendsList';

const Friends = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [selfUserId, setSelfUserId] = useState<number>(0);

  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, withLoading] = useLoadingState();

  const {friends, requests, usersBlockingMe} = useFriendsContext();

  const loadSelf = async () => {
    const myUserId = await EncryptedStorage.getItem('user_id');
    if (myUserId) {
      setSelfUserId(parseInt(myUserId, 10));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSelf();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() =>
              navigation.canGoBack() ? navigation.goBack() : null
            }
          />
          <Text>{strings.friends.friends}</Text>
          {requests.length > 0 ? (
            <View style={styles.requests}>
              <TouchableOpacity onPress={() => navigation.navigate('Requests')}>
                <Text size="s" weight="l">
                  {strings.friends.requests + ' (' + requests.length + ')'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        searching={searching}
        setSearching={setSearching}
        setSearchResults={setSearchResults}
        search={text =>
          withLoading(() =>
            search(
              text,
              setSearchText,
              setSearchResults,
              selfUserId,
              usersBlockingMe,
            ),
          )
        }
        searchPrompt={strings.friends.searchFriends}
      />
      {searching ? (
        loading ? (
          <View style={[STYLES.center, STYLES.container]}>
            <ActivityIndicator size="small" color={colors[theme].accent} />
          </View>
        ) : (
          <SearchResult
            searchResults={searchResults}
            friends={friends}
            searchText={searchText}
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
          />
        )
      ) : (
        <FriendsList navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  requests: {
    position: 'absolute',
    right: s(20),
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: s(10),
  },
});

export default Friends;
