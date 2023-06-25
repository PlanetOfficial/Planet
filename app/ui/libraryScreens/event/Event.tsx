import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {s} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import {
  Destination,
  Event,
  EventDetail,
  Poi,
  Suggestion,
} from '../../../utils/types';
import {getEvent} from '../../../utils/api/eventAPI';
import {postSuggestion} from '../../../utils/api/suggestionAPI';

import SuggestionCard from './SuggestionCard';
import Header from './Header';
import { onVote } from './functions';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [myVotes, setMyVotes] = useState<Map<number, number>>(new Map());
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

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

  const loadBookmarks = async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  };

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

  const animation = useRef(new Animated.Value(0)).current;
  const [xPos, setXPos] = useState<number>(0);
  const [yPos, setYPos] = useState<number>(0);
  const [animateFlag, setAnimateFlag] = useState<boolean>(false);
  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion>();
  const [selectedDestination, setSelectedDestination] = useState<Destination>();
  const [displayingSuggestion, setDisplayingSuggestion] = useState<boolean>(false);
  const suggestionRefs = useRef(new Map());

  const cardWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [s(310), s(280)],
  });

  const resetAnimation = useCallback(() => {
    setDisplayingSuggestion(false);
    Animated.timing(animation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  const handleMeasure = (r: {
    measureInWindow: (arg0: (x: number, y: number) => void) => void;
  }) => {
    r.measureInWindow((x: number, y: number) => {
      setXPos(x);
      setYPos(y);
    });
  };

  const onSuggestionPress = (
    suggestion: Suggestion,
    destination: Destination,
  ) => {
    setDisplayingSuggestion(true);
    setSelectedSuggestion(suggestion);
    setSelectedDestination(destination);
    setAnimateFlag(!animateFlag);
    handleMeasure(suggestionRefs.current.get(suggestion.id));
    Animated.timing(animation, {
      toValue: 0.6,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onSuggestionClose = () => {
    setDisplayingSuggestion(false);
    setResetFlag(!resetFlag);
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetAnimation();
      loadBookmarks();
      loadData();
      addSuggestion();
    });

    return unsubscribe;
  }, [navigation, loadData, addSuggestion, resetAnimation]);

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
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <Destinations
          navigation={navigation}
          event={event}
          eventDetail={eventDetail}
          setEventDetail={setEventDetail}
          displayingSuggestion={displayingSuggestion}
          onSuggestionClose={onSuggestionClose}
          myVotes={myVotes}
          setMyVotes={setMyVotes}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          selectedDestination={selectedDestination}
          cardWidth={cardWidth}
          setInsertionDestination={setInsertionDestination}
          loadData={loadData}
          onSuggestionPress={onSuggestionPress}
          suggestionRefs={suggestionRefs}
        />
      )}

      <Animated.View
        pointerEvents={'none'}
        style={[
          styles.dim,
          {
            opacity: animation,
          },
        ]}
      />

      <SuggestionCard
        navigation={navigation}
        bookmarked={bookmarks.some(
          bookmark => bookmark.id === selectedSuggestion?.poi.id,
        )}
        suggestion={selectedSuggestion}
        onSuggestionClose={onSuggestionClose}
        loadData={loadData}
        x={xPos}
        y={yPos}
        resetFlag={resetFlag}
        animateFlag={animateFlag}
        eventId={event.id}
        destination={selectedDestination}
        voted={
          selectedDestination
            ? myVotes.get(selectedDestination?.id) === selectedSuggestion?.id
            : false
        }
        onVote={() => {
          if (selectedDestination && selectedSuggestion) {
            onVote(
              event, setEventDetail, myVotes, setMyVotes, selectedDestination, selectedSuggestion
            )
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dim: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
  },
});

export default EventPage;
