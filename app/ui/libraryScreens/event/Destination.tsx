import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
  Animated,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import PoiCardXS from '../../components/PoiCardXS';
import PoiCardXL from '../../components/PoiCardXL';
import Separator from '../../components/Separator';

import {
  Destination,
  Event,
  EventDetail,
  Poi,
  Suggestion,
} from '../../../utils/types';
import {handleBookmark} from '../../../utils/Misc';

import {onVote} from './functions';

interface Props {
  navigation: any;
  event: Event;
  eventDetail: EventDetail;
  setEventDetail: (eventDetail: EventDetail) => void;
  displayingSuggestion: boolean;
  onSuggestionClose: () => void;
  myVotes: Map<number, number>;
  setMyVotes: (myVotes: Map<number, number>) => void;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  setInsertionDestination: (insertionDestination: Destination) => void;
  loadData: () => void;
  findPrimary: (suggestions: Suggestion[]) => Suggestion;
  selectedDestination: Destination | undefined;
  cardWidth: Animated.AnimatedInterpolation<string | number>;
  suggestionRefs: any; // figure out type
  onSuggestionPress: (suggestion: Suggestion, destination: Destination) => void;
}

const DestinationView: React.FC<Props> = ({
  navigation,
  event,
  eventDetail,
  setEventDetail,
  displayingSuggestion,
  onSuggestionClose,
  myVotes,
  setMyVotes,
  bookmarks,
  setBookmarks,
  refreshing,
  setRefreshing,
  setInsertionDestination,
  loadData,
  findPrimary,
  selectedDestination,
  cardWidth,
  suggestionRefs,
  onSuggestionPress,
}) => {
  return (
    <FlatList
      contentContainerStyle={STYLES.scrollView}
      showsVerticalScrollIndicator={false}
      data={eventDetail.destinations}
      onTouchStart={onSuggestionClose}
      renderItem={({item}: {item: Destination}) => (
        <View style={styles.destination}>
          <View style={styles.destinationHeader}>
            <Text>{item.name}</Text>
            <Icon
              icon={icons.roulette}
              size="l"
              disabled={
                displayingSuggestion ||
                !item.suggestions.some(
                  suggestion => suggestion.votes.length > 0,
                )
              }
              color={
                !item.suggestions.some(
                  suggestion => suggestion.votes.length > 0,
                )
                  ? colors.grey
                  : colors.accent
              }
              onPress={() =>
                navigation.navigate('Roulette', {
                  eventId: event.id,
                  destination: item,
                })
              }
            />
          </View>
          <TouchableOpacity
            style={styles.destinationCard}
            disabled={displayingSuggestion}
            onPress={() =>
              navigation.navigate('Poi', {
                poi: findPrimary(item.suggestions).poi,
                bookmarked: bookmarks.some(
                  bookmark =>
                    bookmark.id === findPrimary(item.suggestions).poi.id,
                ),
                mode: 'none',
              })
            }>
            <PoiCardXL
              poi={findPrimary(item.suggestions).poi}
              disabled={displayingSuggestion}
              bookmarked={bookmarks.some(
                bookmark =>
                  bookmark.id === findPrimary(item.suggestions).poi.id,
              )}
              width={item.id === selectedDestination?.id ? cardWidth : s(310)}
              handleBookmark={(poi: Poi) =>
                handleBookmark(poi, bookmarks, setBookmarks)
              }
              voted={
                findPrimary(item.suggestions)
                  ? myVotes.get(item.id) === findPrimary(item.suggestions).id
                  : false
              }
              onVote={() => {
                onVote(
                  event,
                  setEventDetail,
                  myVotes,
                  setMyVotes,
                  item,
                  findPrimary(item.suggestions),
                );
              }}
            />
          </TouchableOpacity>
          {item.suggestions.length > 1 ? (
            <View style={styles.suggestions}>
              <ScrollView
                style={styles.suggestionsScrollView}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {item.suggestions.map((suggestion: Suggestion) =>
                  !suggestion.is_primary ? (
                    <TouchableOpacity
                      key={suggestion.id}
                      ref={r => suggestionRefs.current.set(suggestion.id, r)}
                      style={styles.suggestion}
                      disabled={displayingSuggestion}
                      onPress={() => onSuggestionPress(suggestion, item)}>
                      <PoiCardXS poi={suggestion.poi} />
                    </TouchableOpacity>
                  ) : null,
                )}
              </ScrollView>
              <View style={styles.addSuggestion}>
                <TouchableOpacity
                  style={styles.addSuggestion}
                  disabled={displayingSuggestion}
                  onPress={() => {
                    setInsertionDestination(item);
                    navigation.navigate('SuggestSearch');
                  }}>
                  <Icon icon={icons.add} size="xl" color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addSuggestionBig, STYLES.shadow]}
              disabled={displayingSuggestion}
              onPress={() => {
                setInsertionDestination(item);
                navigation.navigate('SuggestSearch');
              }}>
              <Text color={colors.accent} weight="b">
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
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }}
          tintColor={colors.accent}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  destination: {
    marginHorizontal: s(20),
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(15),
    paddingHorizontal: s(5),
  },
  destinationCard: {
    alignItems: 'center',
    justifyContent: 'center',
    height: s(310 / 1.6),
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
  dim: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
  },
});

export default DestinationView;
