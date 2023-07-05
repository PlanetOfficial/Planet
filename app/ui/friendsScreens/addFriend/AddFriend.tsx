import React, {useState, useEffect, useContext} from 'react';
import {View, useColorScheme, StatusBar, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import { s } from 'react-native-size-matters';

import colors from '../../../constants/colors';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';

import Header from './Header';
import SearchResult from './SearchResult';
import Friends from './Friends';

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

  const [invitees, setInvitees] = useState<UserInfo[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }

  const [fgSelected, setFgSelected] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setInvitees(route.params.members);
    });

    return unsubscribe;
  }, [navigation, route.params.members]);

  const onAdd = async () => {
    navigation.navigate('Create', {members: invitees});
  };

  return (
    <View style={STYLES.container}>
      <Header
        navigation={navigation}
        searching={searching}
        setSearching={setSearching}
        setLoading={setLoading}
        searchText={searchText}
        setSearchText={setSearchText}
        setSearchResults={setSearchResults}
      />

      {searching ? (
        <SearchResult
          searchText={searchText}
          searchResults={searchResults}
          invitees={invitees}
          setInvitees={setInvitees}
          loading={loading}
        />
      ) : (
        <Friends
          fgSelected={fgSelected}
          setFgSelected={setFgSelected}
          invitees={invitees}
          setInvitees={setInvitees}
        />
      )}

      <View style={styles.footer}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(10),
    backgroundColor: colors.light.background,
  },
});

export default AddFriend;
