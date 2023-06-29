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
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';
import EventRow from '../../components/EventRow';

import {getEvents} from '../../../utils/api/eventAPI';
import {Event} from '../../../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Library = ({navigation}: {navigation: any}) => {
  const [self, setSelf] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    const _self = await AsyncStorage.getItem('username');
    if (_self) {
      setSelf(_self);
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
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          style={styles.list}
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
              <Text size="s" color={colors.black}>
                {strings.event.noEventsFoundDescription}
              </Text>
            </View>
          }
          ItemSeparatorComponent={Separator}
          keyExtractor={(item: Event) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData()}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: s(15),
    paddingTop: s(5),
    borderTopWidth: 1,
    borderTopColor: colors.grey,
  },
});

export default Library;
