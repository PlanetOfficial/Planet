import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import {s} from 'react-native-size-matters';

import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';
import colors from '../../constants/colors';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {
  getNotificationSettings,
  toggleNotifyEventInvite,
  toggleNotifyFriendRequest,
  toggleNotifyFriendRequestAccept,
  toggleNotifyNewSuggestion,
  toggleNotifySetPrimary,
} from '../../utils/api/notificationsAPI';
import {NotificationSettings as NS} from '../../utils/types';

const NotificationSettings = ({navigation}: {navigation: any}) => {
  const [notificationsSettings, setNotificationsSettings] = useState<NS>();

  const initializeData = async () => {
    const response = await getNotificationSettings();

    if (response) {
      setNotificationsSettings(response);
    } else {
      Alert.alert('TODO CHANGE THIS');
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
      Alert.alert('TODO CHANGE THIS');
    }
  };

  const settings = [
    {
      name: 'Friend Requests',
      value: 'notify_friend_requests' as keyof NS,
      description:
        'Receive notifications when someone sends you a friend request',
      onPress: () =>
        toggle(toggleNotifyFriendRequest, 'notify_friend_requests' as keyof NS),
    },
    {
      name: 'Friend Requests Accepted',
      value: 'notify_friend_requests_accept' as keyof NS,
      description:
        'Receive notifications when someone accepts your friend request',
      onPress: () =>
        toggle(
          toggleNotifyFriendRequestAccept,
          'notify_friend_requests_accept' as keyof NS,
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
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={localStyles.title}>
            <Text size="l">{strings.settings.notifications}</Text>
          </View>
        </View>
      </SafeAreaView>
      {notificationsSettings ? (
        <ScrollView style={localStyles.content}>
          {settings.map((setting, index) => (
            <View key={index} style={localStyles.row}>
              <View style={localStyles.texts}>
                <Text weight="l">{setting.name}</Text>
                <View style={localStyles.separator} />
                <Text size="s" weight="l" color={colors.darkgrey}>
                  {setting.description}
                </Text>
              </View>
              <Switch
                trackColor={{false: colors.grey, true: colors.accent}}
                thumbColor={colors.white}
                ios_backgroundColor={colors.grey}
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

const localStyles = StyleSheet.create({
  title: {
    flex: 1,
    marginLeft: s(10),
  },
  content: {
    marginTop: s(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: s(20),
    paddingRight: s(20),
    paddingVertical: s(20),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightgrey,
  },
  texts: {
    flex: 1,
    marginHorizontal: s(15),
  },
  separator: {
    height: s(5),
  },
});

export default NotificationSettings;
