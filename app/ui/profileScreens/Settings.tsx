import React from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {clearCaches} from '../../utils/CacheHelpers';

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

  const settingsItems = [
    {
      name: 'Profile',
      icon: icons.profile,
      onPress: () => navigation.navigate('ProfileSettings'),
    },
    {
      name: 'Privacy',
      icon: icons.privacy,
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      name: 'Locations',
      icon: icons.pin,
      onPress: () => navigation.navigate('LocationsSettings'),
    },
    {
      name: 'Push notifications',
      icon: icons.bell,
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      name: 'Account',
      icon: icons.accountSettings,
      onPress: () => navigation.navigate('AccountSettings'),
    },
    {
      name: 'Contact Us',
      icon: icons.close, // TODO: replace with phone
      onPress: () => navigation.navigate('ContactUs'),
    },
  ];

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
            <Text size="l">{strings.settings.settings}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        {settingsItems.map((settingsItem, index) => (
          <TouchableOpacity
            key={index}
            style={localStyles.row}
            onPress={settingsItem.onPress}>
            <Icon size="l" icon={settingsItem.icon} color={colors.darkgrey} />
            <View style={localStyles.text}>
              <Text>{settingsItem.name}</Text>
            </View>
            <Icon icon={icons.next} />
          </TouchableOpacity>
        ))}
        <View style={localStyles.footer}>
          <Text size="s" weight="l" color={colors.darkgrey}>
            Privacy Policy and Stuff. This is a totally legit app and our
            company is not run by babies.
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    marginHorizontal: s(20),
    paddingHorizontal: s(10),
    paddingVertical: s(25),
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
  },
  text: {
    flex: 1,
    marginHorizontal: s(20),
  },
  footer: {
    margin: s(50),
  },
});

export default Settings;
