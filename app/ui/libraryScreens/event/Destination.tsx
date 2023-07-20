import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
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
import Suggestions from './Suggestions';

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
  suggestionRefs: React.MutableRefObject<Map<number, any>>;
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
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return (
    <FlatList
      contentContainerStyle={STYLES.scrollView}
      showsVerticalScrollIndicator={false}
      data={eventDetail.destinations}
      onTouchStart={onSuggestionClose}
      renderItem={({item}: {item: Destination}) =>
        item.suggestions.length > 0 ? (
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
                    ? colors[theme].secondary
                    : colors[theme].accent
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
                place={findPrimary(item.suggestions).poi}
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
            <Suggestions
              navigation={navigation}
              destination={item}
              displayingSuggestion={displayingSuggestion}
              setInsertionDestination={setInsertionDestination}
              suggestionRefs={suggestionRefs}
              onSuggestionPress={onSuggestionPress}
            />
          </View>
        ) : null
      }
      ItemSeparatorComponent={Separator}
      keyExtractor={(item: Destination) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }}
          tintColor={colors[theme].accent}
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
    paddingTop: s(15),
    paddingBottom: s(10),
    paddingHorizontal: s(5),
  },
  destinationCard: {
    alignItems: 'center',
    justifyContent: 'center',
    height: s(310 / 1.6),
  },
});

export default DestinationView;
