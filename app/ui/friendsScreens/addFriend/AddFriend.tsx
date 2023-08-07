import React, {useState, useEffect} from 'react';
import {View, useColorScheme, StatusBar} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import STYLING from '../../../constants/styles';

import {UserInfo} from '../../../utils/types';

import Header from './Header';
import SearchResult from './SearchResult';
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
  const [loading, setLoading] = useState<boolean>(false);

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
      <Header
        navigation={navigation}
        isEvent={!!eventId}
        invitees={invitees}
        searching={searching}
        setSearching={setSearching}
        setLoading={setLoading}
        searchText={searchText}
        setSearchText={setSearchText}
        setSearchResults={setSearchResults}
        selfUserId={selfUserId}
      />

      {searching ? (
        <SearchResult
          searchText={searchText}
          searchResults={searchResults}
          members={members}
          invitees={invitees}
          setInvitees={setInvitees}
          loading={loading}
        />
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
