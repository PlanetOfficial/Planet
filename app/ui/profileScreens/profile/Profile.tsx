import React, {useEffect, useState, useCallback} from 'react';
import {View, useColorScheme, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import STYLING from '../../../constants/styles';

import ProfileHeader from '../../friendsScreens/user/ProfileHeader';
import ProfileBody from './ProfileBody';

import {fetchUserLocation} from '../../../utils/Misc';
import {Coordinate} from '../../../utils/types';

const Profile = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [pfpURL, setPfpURL] = useState<string>('');
  const [location, setLocation] = useState<Coordinate>();

  const initializeData = useCallback(async () => {
    setLocation(await fetchUserLocation());
    const _firstName = await AsyncStorage.getItem('first_name');
    const _lastName = await AsyncStorage.getItem('last_name');
    const _username = await AsyncStorage.getItem('username');
    const _pfpURL = await AsyncStorage.getItem('pfp_url');
    setFirstName(_firstName || '');
    setLastName(_lastName || '');
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
          id: 0,
          first_name: firstName,
          last_name: lastName,
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
