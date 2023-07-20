import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  StatusBar,
  Linking,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/SeparatorR';

import {version} from '../../../../package.json';

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
    // {
    //   name: 'Privacy',
    //   icon: icons.privacy,
    //   onPress: () => Alert.alert('Nothing to see here'),
    // },
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
      icon: icons.open,
      onPress: () => Linking.openURL(strings.main.url),
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
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(strings.main.url + '/privacy-policy')
            }>
            <Text
              size="s"
              weight="l"
              underline={true}
              color={colors[theme].accent}>
              {strings.settings.privacyPolicy}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(strings.main.url + '/terms-and-conditions')
            }>
            <Text
              size="s"
              weight="l"
              underline={true}
              color={colors[theme].accent}>
              {strings.settings.termsAndConditions}
            </Text>
          </TouchableOpacity>
          <Text size="s" weight="l" color={colors[theme].neutral}>
            {strings.settings.version + ' ' + version}
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: s(50),
    height: s(80),
  },
});

export default Settings;
