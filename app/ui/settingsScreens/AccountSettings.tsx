import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {s} from 'react-native-size-matters';

import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';
import colors from '../../constants/colors';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {clearCaches} from '../../utils/CacheHelpers';
import Separator from '../components/Separator';
import {removeAccount} from '../../utils/api/authAPI';
import EncryptedStorage from 'react-native-encrypted-storage';

const AccountSettings = ({navigation}: {navigation: any}) => {
  const handleLogout = async () => {
    try {
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
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={localStyles.title}>
            <Text size="l">{strings.settings.account}</Text>
          </View>
        </View>
      </SafeAreaView>
      <TouchableOpacity
        style={localStyles.row}
        onPress={handleResetPassword}>
        <Text weight="l">{strings.settings.resetPassword}</Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={localStyles.row} onPress={handleLogout}>
        <Text weight="l" color={colors.red}>
          {strings.settings.logout}
        </Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={localStyles.row} onPress={handleRemoveAccount}>
        <Text weight="l" color={colors.red}>
          {strings.settings.removeAccount}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  title: {
    flex: 1,
    marginLeft: s(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(35),
    paddingVertical: s(20),
  },
});

export default AccountSettings;
