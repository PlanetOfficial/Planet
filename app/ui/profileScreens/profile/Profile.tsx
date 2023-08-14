import React, {useEffect, useState, useCallback} from 'react';
import {View, useColorScheme, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import STYLING from '../../../constants/styles';

import ProfileHeader from '../../friendsScreens/user/ProfileHeader';
import ProfileBody from './ProfileBody';

import {fetchUserLocation} from '../../../utils/Misc';
import {Coordinate} from '../../../utils/types';

const Profile = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  const [selfUserId, setSelfUserId] = useState<number>(0);
  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [pfpURL, setPfpURL] = useState<string>('');
  const [location, setLocation] = useState<Coordinate>();

  const initializeData = useCallback(async () => {
    setLocation(await fetchUserLocation());
    const _selfUserId = await EncryptedStorage.getItem('user_id');
    const _displayName = await AsyncStorage.getItem('display_name');
    const _username = await AsyncStorage.getItem('username');
    const _pfpURL = await AsyncStorage.getItem('pfp_url');
    setSelfUserId(Number(_selfUserId) || 0);
    setDisplayName(_displayName || '');
    setUsername(_username || '');
    setPfpURL(_pfpURL || '');
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      StatusBar.setBarStyle(colors[theme].statusBar, true);
    });

    return unsubscribe;
  }, [navigation, theme, initializeData]);

  return (
    <View style={STYLES.container}>
      <ProfileHeader
        navigation={navigation}
        user={{
          id: selfUserId,
          display_name: displayName,
          username: username,
          icon: {
            url: pfpURL,
          },
        }}
        isSelf={true}
        isPage={false}
      />
      <ProfileBody navigation={navigation} location={location} />
    </View>
  );
};

export default Profile;
