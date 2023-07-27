import React, {useEffect, useState, useCallback} from 'react';
import {View, SafeAreaView, useColorScheme, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

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
      <SafeAreaView>
        <View style={STYLES.header}>
          <Text size="l">{strings.profile.yourProfile}</Text>
          <Icon
            icon={icons.settings}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </SafeAreaView>
      <ProfileBody
        navigation={navigation}
        firstName={firstName}
        lastName={lastName}
        username={username}
        pfpURL={pfpURL}
        location={location}
      />
    </View>
  );
};

export default Profile;
