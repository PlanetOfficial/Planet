import React, {useRef, useState} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';

import {
  Destination,
  Event,
  EventDetail,
  Poi,
  Suggestion,
} from '../../../utils/types';

import DestinationView from './Destination';
import SuggestionCard from './SuggestionCard';
import {onVote} from './functions';

interface Props {
  navigation: any;
  event: Event;
  eventDetail: EventDetail;
  setEventDetail: (eventDetail: EventDetail) => void;
  animation: Animated.Value;
  displayingSuggestion: boolean;
  setDisplayingSuggestion: (displayingSuggestion: boolean) => void;
  onSuggestionClose: () => void;
  myVotes: Map<number, number>;
  setMyVotes: (myVotes: Map<number, number>) => void;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  resetFlag: boolean;
  setInsertionDestination: (insertionDestination: Destination) => void;
  loadData: () => void;
}

const Destinations: React.FC<Props> = ({
  navigation,
  event,
  eventDetail,
  setEventDetail,
  displayingSuggestion,
  setDisplayingSuggestion,
  animation,
  onSuggestionClose,
  myVotes,
  setMyVotes,
  bookmarks,
  setBookmarks,
  refreshing,
  setRefreshing,
  resetFlag,
  setInsertionDestination,
  loadData,
}) => {
  const [xPos, setXPos] = useState<number>(0);
  const [yPos, setYPos] = useState<number>(0);
  const [animateFlag, setAnimateFlag] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion>();
  const [selectedDestination, setSelectedDestination] = useState<Destination>();
  const suggestionRefs = useRef<Map<number, any>>(new Map());
  const cardWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [s(310), s(280)],
  });

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

  const findPrimary = (suggestions: Suggestion[]) => {
    const primarySuggestion = suggestions.find(
      suggestion => suggestion.is_primary,
    );
    if (primarySuggestion) {
      return primarySuggestion;
    } else {
      console.warn('No primary suggestion found, returning first suggestion');
      return suggestions[0];
    }
  };

  return (
    <>
      <DestinationView
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
        setInsertionDestination={setInsertionDestination}
        loadData={loadData}
        findPrimary={findPrimary}
        selectedDestination={selectedDestination}
        cardWidth={cardWidth}
        suggestionRefs={suggestionRefs}
        onSuggestionPress={onSuggestionPress}
      />

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
              event,
              setEventDetail,
              myVotes,
              setMyVotes,
              selectedDestination,
              selectedSuggestion,
            );
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dim: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.dark.background,
  },
});

export default Destinations;
