import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  Animated,
  useColorScheme,
  StatusBar,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import BookmarkContext from '../../../context/BookmarkContext';

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
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [event] = useState<Event>(route.params.event);
  const [eventDetail, setEventDetail] = useState<EventDetail>();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const animation = useRef(new Animated.Value(0)).current;
  const [myVotes, setMyVotes] = useState<Map<number, number>>(new Map());
  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const [displayingSuggestion, setDisplayingSuggestion] =
    useState<boolean>(false);
  const [insertionDestination, setInsertionDestination] =
    useState<Destination>();

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  const loadData = useCallback(async () => {
    const myUserId = await EncryptedStorage.getItem('user_id');

    const _eventDetail = await getEvent(event.id);
    if (_eventDetail && myUserId) {
      setEventDetail(_eventDetail);

      const _myVotes = new Map<number, number>();
      _eventDetail.destinations.forEach(dest => {
        dest.suggestions.forEach(sugg => {
          if (sugg.votes.some(_vote => _vote.id === parseInt(myUserId, 10))) {
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
      addSuggestion();
      resetAnimation();
    });

    return unsubscribe;
  }, [navigation, loadData, addSuggestion, resetAnimation]);

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
          <ActivityIndicator size="small" color={colors[theme].accent} />
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
