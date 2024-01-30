import React, {useState, useEffect} from 'react';
import {
  View,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';
import SearchBar from '../../components/SearchBar';
import SearchResult from '../components/SearchResult';

import {UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';

import {useFriendsContext} from '../../../context/FriendsContext';

import {search} from '../friends/functions';

import Header from './Header';
import Friends from './Friends';
import Footer from './Footer';

const AddFriend = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      members: UserInfo[];
      event_id?: number;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [eventId, setEventId] = useState<number>();
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [invitees, setInvitees] = useState<UserInfo[]>([]);

  const [selfUserId, setSelfUserId] = useState<number>(0);

  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, withLoading] = useLoadingState();

  const {friends, usersBlockingMe} = useFriendsContext();

  const [fgSelected, setFgSelected] = useState<number>(0);

  const loadSelf = async () => {
    const myUserId = await EncryptedStorage.getItem('user_id');
    if (myUserId) {
      setSelfUserId(parseInt(myUserId, 10));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params.event_id) {
        setEventId(route.params.event_id);
        setMembers(route.params.members);
      } else {
        setInvitees(route.params.members);
      }
      loadSelf();
    });

    return unsubscribe;
  }, [navigation, route.params]);

  return (
    <View style={STYLES.container}>
      <Header navigation={navigation} isEvent={!!eventId} />

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
              friends,
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
                disabled={members.some(user => user.id === item.id)}
                onPress={() => {
                  if (invitees?.find(user => user.id === item.id)) {
                    setInvitees(invitees.filter(user => user.id !== item.id));
                  } else {
                    setInvitees([...(invitees || []), item]);
                  }
                }}>
                <UserRow user={item}>
                  <Icon
                    size="m"
                    color={
                      members.some(user => user.id === item.id)
                        ? colors[theme].secondary
                        : colors[theme].accent
                    }
                    icon={
                      members
                        .concat(invitees)
                        ?.find(user => user.id === item.id)
                        ? icons.selected
                        : icons.unselected
                    }
                  />
                </UserRow>
              </TouchableOpacity>
            )}
          />
        )
      ) : (
        <Friends
          isEvent={!!eventId}
          fgSelected={fgSelected}
          setFgSelected={setFgSelected}
          members={members}
          invitees={invitees}
          setInvitees={setInvitees}
        />
      )}

      <Footer
        navigation={navigation}
        isEvent={!!eventId}
        eventId={eventId}
        invitees={invitees}
        setInvitees={setInvitees}
      />
    </View>
  );
};

export default AddFriend;
