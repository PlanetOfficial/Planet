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

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import Separator from '../components/Separator';
import EventRow from '../components/EventRow';

import {getEvents} from '../../utils/api/eventAPI';
import {Event} from '../../utils/types';

const Library = ({navigation}: {navigation: any}) => {
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    setRefreshing(true);
    const _events = await getEvents();

    if (_events) {
      setEvents(_events);
    } else {
      Alert.alert('Error', 'Could not fetch events, please try again.');
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
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
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
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          style={localStyles.list}
          data={events}
          renderItem={({item}: {item: Event}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Event', {
                    event: item,
                  })
                }>
                <EventRow event={item} />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>{strings.event.noEventsFound}</Text>
              <Text> </Text>
              <Text size="s" color={colors.darkgrey}>
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
              tintColor={colors.accent}
            />
          }
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  list: {
    marginTop: s(10),
    borderTopWidth: 0.5,
    borderTopColor: colors.lightgrey,
  },
});

export default Library;
