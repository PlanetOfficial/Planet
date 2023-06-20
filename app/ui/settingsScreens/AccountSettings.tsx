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
        onPress={() => navigation.navigate('ForgotPassword')}>
        <Text weight="l">{strings.settings.resetPassword}</Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={localStyles.row} onPress={handleLogout}>
        <Text weight="l" color={colors.red}>
          {strings.settings.logout}
        </Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity
        style={localStyles.row}
        onPress={() => Alert.alert('Remove Account not implemented yet')}>
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
