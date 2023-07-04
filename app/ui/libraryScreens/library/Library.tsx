import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import EventRow from '../../components/EventRow';

import {getEvents} from '../../../utils/api/eventAPI';
import {Event} from '../../../utils/types';

const Library = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [self, setSelf] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    const myUserId = await AsyncStorage.getItem('user_id');
    if (myUserId) {
      setSelf(parseInt(myUserId, 10));
    }

    const _events = await getEvents();

    if (_events) {
      setEvents(_events);
    } else {
      Alert.alert(strings.error.error, strings.error.fetchEvents);
    }
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Text size="l">{strings.event.yourEvents}</Text>
          <Icon
            icon={icons.bell}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('Notifications')}
          />
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={STYLES.center}>
          <ActivityIndicator size="small" color={colors[theme].accent} />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.content}
          data={events}
          renderItem={({item}: {item: Event}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Event', {
                    event: item,
                  })
                }>
                <EventRow event={item} self={self} />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={STYLES.center}>
              <Text>{strings.event.noEventsFound}</Text>
              <Text> </Text>
              <Text size="s">{strings.event.noEventsFoundDescription}</Text>
            </View>
          }
          keyExtractor={(item: Event) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData()}
              tintColor={colors[theme].accent}
            />
          }
        />
      )}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    list: {
      paddingTop: s(5),
      borderTopColor: colors[theme].secondary,
    },
    content: {
      paddingBottom: s(20),
    },
  });

export default Library;
