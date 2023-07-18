import React, { useEffect, useState } from 'react';
import {View, SafeAreaView, useColorScheme, StatusBar, FlatList} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import { Notification } from '../../../utils/types';
import { getEventsNotifications } from '../../../utils/api/eventAPI';

const Notifications = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const initializeNotifications = async () => {
    const _notifications = await getEventsNotifications();

    if (_notifications) {
      setNotifications(_notifications);
    } else {
      console.warn('Failed to get notifications');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeNotifications();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.notifications.notifications}</Text>
          <Icon
            icon={icons.settings}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('NotificationSettings')}
          />
        </View>
      </SafeAreaView>

      <FlatList
        data={notifications}
        renderItem={({item}) => (
          <View>
            <Text>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Notifications;
