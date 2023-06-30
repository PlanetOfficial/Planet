import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Alert, ActivityIndicator, Animated} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import {Destination, Event, EventDetail, Poi} from '../../../utils/types';
import {getEvent} from '../../../utils/api/eventAPI';
import {postSuggestion} from '../../../utils/api/suggestionAPI';

import Header from './Header';
import Destinations from './Destinations';

const EventPage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      event: Event;
      destination: Poi;
    };
  };
}) => {
  const [event] = useState<Event>(route.params.event);
  const [eventDetail, setEventDetail] = useState<EventDetail>();
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const animation = useRef(new Animated.Value(0)).current;
  const [myVotes, setMyVotes] = useState<Map<number, number>>(new Map());
  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const [displayingSuggestion, setDisplayingSuggestion] =
    useState<boolean>(false);
  const [insertionDestination, setInsertionDestination] =
    useState<Destination>();

  const loadData = useCallback(async () => {
    const _username = await AsyncStorage.getItem('username');

    const _eventDetail = await getEvent(event.id);
    if (_eventDetail) {
      setEventDetail(_eventDetail);

      const _myVotes = new Map<number, number>();
      _eventDetail.destinations.forEach(dest => {
        dest.suggestions.forEach(sugg => {
          if (sugg.votes.some(_vote => _vote.username === _username)) {
            _myVotes.set(dest.id, sugg.id);
          }
        });
      });
      setMyVotes(_myVotes);
    } else {
      Alert.alert(strings.error.error, strings.error.fetchEvent);
    }
    setRefreshing(false);
    setLoading(false);
  }, [event.id]);

  const loadBookmarks = useCallback(async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  }, []);

  const addSuggestion = useCallback(async () => {
    const suggestion = route.params.destination;

    if (suggestion && insertionDestination) {
      const response = await postSuggestion(
        event.id,
        insertionDestination.id,
        suggestion.id,
      );

      if (response) {
        loadData();
      } else {
        Alert.alert(strings.error.error, strings.error.addSuggestion);
      }

      navigation.setParams({destination: undefined});
    }
  }, [
    event.id,
    insertionDestination,
    loadData,
    navigation,
    route.params.destination,
  ]);

  const resetAnimation = useCallback(() => {
    setDisplayingSuggestion(false);
    Animated.timing(animation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
      loadBookmarks();
      addSuggestion();
      resetAnimation();
    });

    return unsubscribe;
  }, [navigation, loadData, loadBookmarks, addSuggestion, resetAnimation]);

  const onSuggestionClose = () => {
    setDisplayingSuggestion(false);
    setResetFlag(!resetFlag);
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={STYLES.container}>
      <Header
        navigation={navigation}
        event={event}
        eventDetail={eventDetail}
        displayingSuggestion={displayingSuggestion}
        onSuggestionClose={onSuggestionClose}
      />

      {loading || !eventDetail ? (
        <View style={STYLES.center}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <Destinations
          navigation={navigation}
          event={event}
          eventDetail={eventDetail}
          setEventDetail={setEventDetail}
          displayingSuggestion={displayingSuggestion}
          setDisplayingSuggestion={setDisplayingSuggestion}
          animation={animation}
          onSuggestionClose={onSuggestionClose}
          myVotes={myVotes}
          setMyVotes={setMyVotes}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          resetFlag={resetFlag}
          setInsertionDestination={setInsertionDestination}
          loadData={loadData}
        />
      )}
    </View>
  );
};

export default EventPage;
