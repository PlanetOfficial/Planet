import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Animated,
} from 'react-native';
import {s} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PoiCardXS from '../components/PoiCardXS';
import PoiCardXL from '../components/PoiCardXL';
import Separator from '../components/Separator';

import {
  Destination,
  Event,
  EventDetail,
  Poi,
  Suggestion,
} from '../../utils/types';
import {getEvent} from '../../utils/api/eventAPI';
import {handleBookmark} from '../../utils/Misc';
import {postSuggestion} from '../../utils/api/suggestionAPI';
import strings from '../../constants/strings';
import SuggestionCard from '../components/SuggestionCard';

const EventPage = ({navigation, route}: {navigation: any; route: any}) => {
  const date = new Date();

  const [event] = useState<Event>(route.params.event);

  const [eventDetail, setEventDetail] = useState<EventDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);

  const [insertionDestination, setInsertionDestionation] =
    useState<Destination>();

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

  const addSuggestion = useCallback(async () => {
    const suggestion = route.params?.destination;

    if (suggestion && insertionDestination) {
      const response = await postSuggestion(
        event.id,
        insertionDestination.id,
        suggestion.id,
      );

      if (response) {
        loadData();
      } else {
        Alert.alert('Error', 'Could not add suggestion, please try again.');
      }

      navigation.setParams({destination: undefined});
    }
  }, [
    event.id,
    insertionDestination,
    loadData,
    navigation,
    route.params?.destination,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetAnimation();
      loadData();
      loadBookmarks();
      addSuggestion();
    });

    return unsubscribe;
  }, [navigation, loadData, addSuggestion]);

  const findPrimaryPoi = (suggestions: Suggestion[]) => {
    const primarySuggestion = suggestions.find(
      suggestion => suggestion.is_primary,
    );
    if (primarySuggestion) {
      return primarySuggestion.poi;
    } else {
      console.warn('No primary suggestion found, returning first suggestion');
      return suggestions[0].poi;
    }
  };

  const animation = useRef(new Animated.Value(0)).current;
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion>();
  const suggestionRefs = useRef(new Map());

  const resetAnimation = () => {
    setDisplayingSuggestion(false);
    Animated.timing(animation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  const [displayingSuggestion, setDisplayingSuggestion] =
    useState<boolean>(false);

  const [xPos, setXPos] = useState<number>(0);
  const [yPos, setYPos] = useState<number>(0);

  const handleMeasure = (r: {
    measureInWindow: (arg0: (x: number, _y: number) => void) => void;
  }) => {
    r.measureInWindow((x: number, y: number) => {
      setXPos(x);
      setYPos(y);
    });
  };

  const [animateFlag, setAnimateFlag] = useState<boolean>(false);
  const onSuggestionPress = (suggestion: Suggestion) => {
    setDisplayingSuggestion(true);
    setSelectedSuggestion(suggestion);
    setAnimateFlag(!animateFlag);
    handleMeasure(suggestionRefs.current.get(suggestion.id));
    Animated.timing(animation, {
      toValue: 0.6,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const [resetFlag, setResetFlag] = React.useState<boolean>(false);
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
    <View style={styles.container}>
      <SafeAreaView onTouchStart={onSuggestionClose}>
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
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          data={eventDetail.destinations}
          onTouchStart={onSuggestionClose}
          renderItem={({item}: {item: Destination}) => (
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
                    bookmarked: bookmarks.some(
                      bookmark => bookmark.id === item.suggestions[0].poi.id,
                    ),
                    mode: 'none',
                  })
                }>
                <PoiCardXL
                  poi={findPrimaryPoi(item.suggestions)}
                  bookmarked={bookmarks.some(
                    bookmark => bookmark.id === item.suggestions[0].poi.id,
                  )}
                  handleBookmark={(poi: Poi) =>
                    handleBookmark(poi, bookmarks, setBookmarks)
                  }
                />
              </TouchableOpacity>
              {item.suggestions.length > 1 ? (
                <View style={localStyles.suggestions}>
                  <ScrollView
                    style={localStyles.suggestionsScrollView}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {item.suggestions.map((suggestion: Suggestion) =>
                      !suggestion.is_primary ? (
                        <TouchableOpacity
                          key={suggestion.id}
                          ref={r =>
                            suggestionRefs.current.set(suggestion.id, r)
                          }
                          style={localStyles.suggestion}
                          disabled={displayingSuggestion}
                          onPress={() => onSuggestionPress(suggestion)}>
                          <PoiCardXS poi={suggestion.poi} />
                        </TouchableOpacity>
                      ) : null,
                    )}
                  </ScrollView>
                  <View style={localStyles.addSuggestion}>
                    <TouchableOpacity
                      style={localStyles.addSuggestion}
                      onPress={() => {
                        setInsertionDestionation(item);
                        navigation.navigate('SuggestSearch');
                      }}>
                      <Icon icon={icons.add} size="xl" color={colors.accent} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[localStyles.addSuggestionBig, styles.shadow]}
                  onPress={() => {
                    setInsertionDestionation(item);
                    navigation.navigate('SuggestSearch');
                  }}>
                  <Text color={colors.accent}>
                    {strings.event.addSuggestion}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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

      <Animated.View
        pointerEvents={'none'}
        style={[
          localStyles.overlay,
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
        x={xPos}
        y={yPos}
        resetFlag={resetFlag}
        animateFlag={animateFlag}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  texts: {
    flex: 1,
    paddingHorizontal: s(10),
  },
  destination: {
    marginHorizontal: s(20),
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(15),
    paddingHorizontal: s(5),
  },
  suggestions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: s(10),
  },
  suggestionsScrollView: {
    overflow: 'visible',
  },
  suggestion: {
    marginRight: s(10),
  },
  addSuggestion: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -s(20),
    paddingRight: s(20),
    width: s(95),
    height: s(85),
    backgroundColor: colors.white,
    borderLeftWidth: 0.5,
    borderLeftColor: colors.grey,
  },
  addSuggestionBig: {
    alignItems: 'center',
    marginVertical: s(10),
    paddingVertical: s(10),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
    elevation: 1,
  },
});

export default EventPage;
