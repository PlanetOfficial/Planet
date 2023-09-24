import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  useColorScheme,
  StatusBar,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';

import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/SeparatorR';
import UserIcon from '../../components/UserIcon';

import {EventNotification} from '../../../utils/types';
import {getEventsNotifications} from '../../../utils/api/eventAPI';

const Notifications = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [notifications, setNotifications] = useState<EventNotification[]>([]);

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
      await initializeNotifications();
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
            onPress={() => navigation.canGoBack() ? navigation.goBack() : console.log('cannot go back')}
          />
          <Text>{strings.notifications.notifications}</Text>
          <Icon
            size="m"
            icon={icons.settings}
            onPress={() => navigation.navigate('NotificationSettings')}
          />
        </View>
      </SafeAreaView>

      <FlatList
        style={STYLES.flatList}
        scrollIndicatorInsets={{right: 1}}
        data={notifications}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.push('Event', {
                event: item.event,
              })
            }>
            <TouchableOpacity
              style={styles.icon}
              onPress={() =>
                navigation.push('User', {
                  user: item.actor,
                })
              }>
              <UserIcon user={item.actor} />
            </TouchableOpacity>
            <View style={styles.text}>
              <Text size="s" weight="l">
                {item.body}
              </Text>
              <View style={styles.spacer} />
              <Text size="xs" weight="l">
                {moment(item.created_at).format('MMM Do, h:mm a')}
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={item.photo ? {uri: item.photo} : icons.placeholder}
                resizeMode={'cover'}
              />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    minHeight: s(80),
  },
  icon: {
    width: s(60),
    height: s(60),
    padding: s(10),
  },
  text: {
    flex: 1,
    marginHorizontal: s(10),
  },
  imageContainer: {
    width: s(60),
    height: s(40),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  spacer: {
    height: s(5),
  },
});

export default Notifications;
