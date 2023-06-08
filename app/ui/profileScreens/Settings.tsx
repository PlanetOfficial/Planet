import React from 'react';
import {View, SafeAreaView, Alert, TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import { clearCaches } from '../../utils/CacheHelpers';

const Settings = ({navigation}: {navigation: any}) => {
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
          <Text>{strings.profile.settings}</Text>
          <Icon
            size="l"
            color={colors.accent}
            icon={icons.add}
            onPress={() => Alert.alert('Add Friend', 'Coming soon!')}
          />
        </View>
        <View>
          <TouchableOpacity style={styles.center} onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
