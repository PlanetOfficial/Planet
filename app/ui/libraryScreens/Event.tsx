import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import {s} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PoiCardXL from '../components/PoiCardXL';
import Separator from '../components/Separator';

import {Destination, Event, EventDetail, Poi} from '../../utils/types';
import {getEvent} from '../../utils/api/eventAPI';
import {handleBookmark} from '../../utils/Misc';

const EventPage = ({navigation, route}: {navigation: any; route: any}) => {
  const date = new Date();

  const [event] = useState<Event>(route.params.event);

  const [eventDetail, setEventDetail] = useState<EventDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const _eventDetail = await getEvent(event.id);
    if (_eventDetail) {
      setEventDetail(_eventDetail);
    } else {
      Alert.alert('Error', 'Could not fetch event, please try again.');
    }
    setRefreshing(false);
    setLoading(false);
  }, [event.id]);

  const loadBookmarks = async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
      loadBookmarks();
    });

    return unsubscribe;
  }, [navigation, loadData]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={localStyles.texts}>
            <Text>{event.name}</Text>
            <Text size="xs" weight="l" color={colors.accent}>
              {moment(event.datetime)
                .add(date.getTimezoneOffset(), 'minutes')
                .format('MMM Do, h:mm a')}
            </Text>
          </View>
          <Icon
            icon={icons.more}
            button={true}
            padding={-2}
            onPress={() => {
              // TODO: Navigate to details tab
            }}
          />
        </View>
      </SafeAreaView>

      {loading || !eventDetail ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={eventDetail.destinations}
          renderItem={({item}: {item: Destination}) => {
            return (
              <View style={localStyles.destination}>
                <View style={localStyles.destinationHeader}>
                  <Text>{item.name}</Text>
                  <Icon
                    icon={icons.roulette}
                    size="l"
                    color={colors.accent}
                    onPress={() => navigation.navigate('Roulette', {})}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PoiDetail', {
                      poi: item.suggestions[0].poi,
                      bookmarked: false,
                    })
                  }>
                  <PoiCardXL
                    poi={item.suggestions[0].poi}
                    bookmarked={bookmarks.some(
                      bookmark => bookmark.id === item.suggestions[0].poi.id,
                    )}
                    handleBookmark={(poi: Poi) =>
                      handleBookmark(poi, bookmarks, setBookmarks)
                    }
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          ItemSeparatorComponent={Separator}
          keyExtractor={(item: Destination) => item.id.toString()}
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
  texts: {
    flex: 1,
    paddingHorizontal: s(20),
  },
  destination: {
    marginHorizontal: s(20),
    marginBottom: s(20),
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(15),
    paddingHorizontal: s(5),
  },
});

export default EventPage;
