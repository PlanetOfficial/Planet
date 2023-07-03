import React, {useContext} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {s} from 'react-native-size-matters';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';

import {clearCaches} from '../../../utils/CacheHelpers';
import {removeAccount} from '../../../utils/api/authAPI';

import FriendsContext from '../../../context/FriendsContext';
import BookmarkContext from '../../../context/BookmarkContext';

const AccountSettings = ({navigation}: {navigation: any}) => {
  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {setBookmarks} = bookmarkContext;

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {
    setRequests,
    setRequestsSent,
    setFriends,
    setSuggestions,
    setFriendGroups,
  } = friendsContext;

  const resetContexts = () => {
    setBookmarks([]);
    setRequests([]);
    setRequestsSent([]);
    setFriends([]);
    setSuggestions([]);
    setFriendGroups([]);
  };

  const handleLogout = async () => {
    try {
      resetContexts();
      clearCaches();
    } catch (error) {
      Alert.alert('Error', 'Unable to logout. Please try again.');
    } finally {
      await messaging().deleteToken();

      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  const handleResetPassword = async () => {
    const authToken = await EncryptedStorage.getItem('auth_token');

    navigation.navigate('ResetPassword', {authToken});
  };

  const handleRemoveAccount = async () => {
    Alert.alert(
      'Remove Account',
      'Are you sure you want to remove your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            Alert.alert('Are you sure?', 'This action cannot be undone.', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Remove',
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
                      'Error',
                      'Unable to remove account. Please try again.',
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
          <View style={STYLES.texts}>
            <Text size="l">{strings.settings.account}</Text>
          </View>
        </View>
      </SafeAreaView>
      <TouchableOpacity style={styles.row} onPress={handleResetPassword}>
        <Text weight="l">{strings.settings.resetPassword}</Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={styles.row} onPress={handleLogout}>
        <Text weight="l" color={colors.red}>
          {strings.settings.logout}
        </Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={styles.row} onPress={handleRemoveAccount}>
        <Text weight="l" color={colors.red}>
          {strings.settings.removeAccount}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(35),
    paddingVertical: s(20),
  },
});

export default AccountSettings;
