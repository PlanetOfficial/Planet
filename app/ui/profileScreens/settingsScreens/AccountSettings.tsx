import React from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';

import {clearCaches} from '../../../utils/CacheHelpers';
import {removeAccount} from '../../../utils/api/authAPI';

import {useBookmarkContext} from '../../../context/BookmarkContext';
import {useFriendsContext} from '../../../context/FriendsContext';

const AccountSettings = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {setBookmarks} = useBookmarkContext();

  const {
    setRequests,
    setRequestsSent,
    setFriends,
    setSuggestions,
    setFriendGroups,
  } = useFriendsContext();

  const resetContexts = () => {
    setBookmarks([]);
    setRequests([]);
    setRequestsSent([]);
    setFriends([]);
    setSuggestions([]);
    setFriendGroups([]);
  };

  const handleLogout = () => {
    Alert.alert(strings.settings.logout, strings.settings.logoutInfo, [
      {
        text: strings.main.cancel,
        style: 'cancel',
      },
      {
        text: strings.settings.logout,
        onPress: async () => {
          try {
            resetContexts();
            clearCaches();
            await messaging().deleteToken();
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          } catch (error) {
            Alert.alert(strings.error.error, strings.error.logout);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleResetPassword = async () => {
    const authToken = await EncryptedStorage.getItem('auth_token');

    navigation.navigate('ResetPwd', {authToken});
  };

  const handleRemoveAccount = () => {
    Alert.alert(
      strings.settings.removeAccount,
      strings.settings.removeAccountInfo,
      [
        {
          text: strings.main.cancel,
          style: 'cancel',
        },
        {
          text: strings.main.remove,
          onPress: () => {
            Alert.alert('Are you sure?', 'This action cannot be undone.', [
              {
                text: strings.main.cancel,
                style: 'cancel',
              },
              {
                text: strings.main.remove,
                onPress: async () => {
                  const response = await removeAccount();

                  if (response) {
                    resetContexts();
                    clearCaches();
                    await messaging().deleteToken();
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    });
                  } else {
                    Alert.alert(
                      strings.error.error,
                      strings.error.removeAccount,
                    );
                  }
                },
                style: 'destructive',
              },
            ]);
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text size="l">{strings.settings.account}</Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        style={STYLES.settingsRow}
        onPress={handleResetPassword}>
        <Text weight="l">{strings.settings.resetPassword}</Text>
        <Icon icon={icons.next} />
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={STYLES.settingsRow} onPress={handleLogout}>
        <Text weight="l" color={colors[theme].red}>
          {strings.settings.logout}
        </Text>
        <Icon size="m" icon={icons.logout} color={colors[theme].red} />
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity
        style={STYLES.settingsRow}
        onPress={handleRemoveAccount}>
        <Text weight="l" color={colors[theme].red}>
          {strings.settings.removeAccount}
        </Text>
        <Icon size="m" icon={icons.removeAccount} color={colors[theme].red} />
      </TouchableOpacity>
    </View>
  );
};

export default AccountSettings;
