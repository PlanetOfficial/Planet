import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/SeparatorR';

const Settings = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const settingsItems = [
    {
      name: 'Profile',
      icon: icons.profile,
      onPress: () => navigation.navigate('ProfileSettings'),
    },
    {
      name: 'Privacy',
      icon: icons.privacy,
      onPress: () => Alert.alert('Nothing to see here'),
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
      icon: icons.call,
      onPress: () => Alert.alert('Nothing to see here'),
    },
  ];

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
            <Text size="l">{strings.settings.settings}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        {settingsItems.map((settingsItem, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.row} onPress={settingsItem.onPress}>
              <Icon size="l" icon={settingsItem.icon} />
              <View style={STYLES.texts}>
                <Text>{settingsItem.name}</Text>
              </View>
              <Icon icon={icons.next} />
            </TouchableOpacity>
            <Separator />
          </View>
        ))}
        <View style={styles.footer}>
          <Text size="s" weight="l">
            Privacy Policy and Stuff. This is a totally legit app and our
            company is not run by babies.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(35),
    paddingVertical: s(25),
  },
  footer: {
    margin: s(50),
  },
});

export default Settings;
