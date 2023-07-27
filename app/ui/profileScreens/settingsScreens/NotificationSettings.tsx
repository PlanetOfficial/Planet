import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
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

import {
  getNotificationSettings,
  toggleNotifyEventInvite,
  toggleNotifyFriendRequest,
  toggleNotifyFriendRequestAccept,
  toggleNotifyNewSuggestion,
  toggleNotifySetPrimary,
} from '../../../utils/api/notificationSettingsAPI';
import {NotificationSettings as NS} from '../../../utils/types';

const NotificationSettings = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [notificationsSettings, setNotificationsSettings] = useState<NS>();

  const initializeData = async () => {
    const response = await getNotificationSettings();

    if (response) {
      setNotificationsSettings(response);
    } else {
      Alert.alert(strings.error.error, strings.error.loadNotifications);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation]);

  const toggle = async (func: () => Promise<Boolean>, key: keyof NS) => {
    const response = await func();
    if (response && notificationsSettings) {
      setNotificationsSettings({
        ...notificationsSettings,
        [key]: !notificationsSettings[key],
      });
    } else {
      Alert.alert(strings.error.error, strings.error.toggleNotifications);
    }
  };

  const settings = [
    {
      name: 'Friend Requests',
      value: 'notify_friend_request' as keyof NS,
      description:
        'Receive notifications when someone sends you a friend request',
      onPress: () =>
        toggle(toggleNotifyFriendRequest, 'notify_friend_request' as keyof NS),
    },
    {
      name: 'Friend Requests Accepted',
      value: 'notify_friend_request_accept' as keyof NS,
      description:
        'Receive notifications when someone accepts your friend request',
      onPress: () =>
        toggle(
          toggleNotifyFriendRequestAccept,
          'notify_friend_request_accept' as keyof NS,
        ),
    },
    {
      name: 'Event Invites',
      value: 'notify_event_invite' as keyof NS,
      description: 'Receive notifications when someone invites you to an event',
      onPress: () =>
        toggle(toggleNotifyEventInvite, 'notify_event_invite' as keyof NS),
    },
    {
      name: 'New Suggestions',
      value: 'notify_new_suggestion' as keyof NS,
      description:
        'Receive notifications when someone makes a new suggestion in an event you are part of',
      onPress: () =>
        toggle(toggleNotifyNewSuggestion, 'notify_new_suggestion' as keyof NS),
    },
    {
      name: 'New Primary Destination',
      value: 'notify_set_primary' as keyof NS,
      description:
        'Receive notifications when someone changes the primary destination in an event you are part of',
      onPress: () =>
        toggle(toggleNotifySetPrimary, 'notify_set_primary' as keyof NS),
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
            <Text size="l">{strings.settings.notifications}</Text>
          </View>
        </View>
      </SafeAreaView>
      {notificationsSettings ? (
        <ScrollView style={styles.content} scrollIndicatorInsets={{right: 1}}>
          {settings.map((setting, index) => (
            <View key={index} style={styles.row}>
              <View style={STYLES.texts}>
                <Text weight="l">{setting.name}</Text>
                <View style={styles.description}>
                  <Text size="s" weight="l">
                    {setting.description}
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{
                  false: colors[theme].secondary,
                  true: colors[theme].accent,
                }}
                thumbColor={colors[theme].primary}
                ios_backgroundColor={colors[theme].secondary}
                onValueChange={setting.onPress}
                value={notificationsSettings[setting.value]}
              />
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    content: {
      marginTop: s(10),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: s(20),
      marginRight: s(20),
      paddingVertical: s(20),
      borderBottomWidth: 1,
      borderBottomColor: colors[theme].secondary,
    },
    description: {
      marginTop: s(5),
      marginRight: s(10),
    },
  });

export default NotificationSettings;
