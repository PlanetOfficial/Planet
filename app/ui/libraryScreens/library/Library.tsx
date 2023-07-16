import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
  StatusBar,
  SectionListProps,
} from 'react-native';
import {s} from 'react-native-size-matters';
import EncryptedStorage from 'react-native-encrypted-storage';

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

  const [selfUserId, setSelfUserId] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    const myUserId = await EncryptedStorage.getItem('user_id');
    if (myUserId) {
      setSelfUserId(parseInt(myUserId, 10));
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
        <SectionList
          sections={[
            {
              title: strings.event.upcomingEvents,
              data: events
                .filter(
                  (event: Event) =>
                    event.datetime &&
                    new Date(
                      new Date(event.datetime).getTime() +
                        new Date(event.datetime).getTimezoneOffset() * 60000,
                    ) >= new Date(Date.now()) &&
                    !event.completed,
                )
                .sort((a: Event, b: Event) => {
                  return new Date(a.datetime) === new Date(b.datetime)
                    ? 0
                    : new Date(a.datetime) > new Date(b.datetime)
                    ? 1
                    : -1;
                }),
            },
            {
              title: strings.event.nonDatedEvents,
              data: events.filter(
                (event: Event) => !event.datetime && !event.completed,
              ),
            },
            {
              title: strings.event.pastEvents,
              data: events.filter(
                (event: Event) =>
                  (event.datetime &&
                    new Date(
                      new Date(event.datetime).getTime() +
                        new Date(event.datetime).getTimezoneOffset() * 60000,
                    ) < new Date(Date.now())) ||
                  event.completed,
              ),
            },
          ]}
          style={styles.list}
          contentContainerStyle={styles.content}
          initialNumToRender={7}
          renderItem={({
            item,
            section,
          }: {
            item: Event;
            section: SectionListProps<Event>['sections'][number];
          }) => {
            return (
              <TouchableOpacity
                style={
                  section.title === strings.event.pastEvents
                    ? styles.transparent
                    : null
                }
                onPress={() =>
                  navigation.navigate('Event', {
                    event: item,
                  })
                }>
                <EventRow event={item} selfUserId={selfUserId} />
              </TouchableOpacity>
            );
          }}
          renderSectionHeader={({section}) => (
            <View style={styles.sectionHeader}>
              <Text size="s">{section.title}</Text>
            </View>
          )}
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
      borderColor: colors[theme].secondary,
    },
    content: {
      paddingBottom: s(20),
    },
    transparent: {
      opacity: 0.75,
    },
    sectionHeader: {
      marginHorizontal: s(20),
      paddingTop: s(10),
      paddingBottom: s(5),
      backgroundColor: colors[theme].background,
      borderBottomWidth: 1,
      borderColor: colors[theme].secondary,
    },
  });

export default Library;
