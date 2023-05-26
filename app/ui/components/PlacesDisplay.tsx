import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import PlaceCard from '../components/PlaceCard';
import ScrollIndicator from '../components/ScrollIndicator';

import {icons} from '../../constants/images';

import {Place} from '../../utils/interfaces/types';
import {deleteVote, postVote} from '../../utils/api/groups/otherAPI';

interface Props {
  navigation: any;
  places: Place[];
  width: number;
  bookmarks: number[];
  setBookmarked: (bookmarked: boolean, place: Place) => void;
  closeDropdown?: () => void;
  index: number;
  setIndex: (index: number) => void;
  displayCategory?: boolean;
  displaySuggester?: boolean;
  isGroupPlace?: boolean;
  reload?: () => void;
  myVote?: number;
  mySuggestions?: number[];
  onRemoveSuggestion?: (group_place_id: number | undefined) => void;
}

const PlacesDisplay: React.FC<Props> = ({
  navigation,
  places,
  width,
  bookmarks,
  setBookmarked,
  closeDropdown,
  index,
  setIndex,
  displayCategory = true,
  isGroupPlace = false,
  reload,
  myVote = -1,
  mySuggestions = [],
  onRemoveSuggestion,
}) => {
  const [voteIndex, setVoteIndex] = React.useState<number>(myVote);

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToPosition = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: (width + s(20)) * index,
          y: 0,
          animated: false,
        });
      }, 10);
    }
  };

  useEffect(() => {
    scrollToPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVote = async (idx: number) => {
    const group_place_id: number | undefined = places[idx].group_place_id;
    if (group_place_id) {
      if (voteIndex === -1) {
        const response = await postVote(group_place_id);
        if (response) {
          setVoteIndex(idx);
        } else {
          Alert.alert('Error', 'Unable to vote. Please try again later');
        }
      } else if (voteIndex === idx) {
        const response = await deleteVote(group_place_id);
        if (response) {
          setVoteIndex(-1);
        } else {
          Alert.alert(
            'Error',
            'Unable to delete the vote. Please try again later',
          );
        }
      } else {
        const _group_place_id: number | undefined =
          places[voteIndex].group_place_id;
        if (_group_place_id) {
          const response1 = await deleteVote(_group_place_id);
          const repsonse2 = await postVote(group_place_id);
          if (response1 && repsonse2) {
            setVoteIndex(idx);
          } else {
            Alert.alert('Error', 'Unable to vote. Please try again later');
          }
        }
      }
      if (reload) {
        reload();
      }
    }
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: (s(350) - width) / 2,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        scrollEventThrottle={16}
        snapToInterval={width + s(20)} // 280 + 20
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        onScroll={event => {
          closeDropdown ? closeDropdown() : null;
          let idx = Math.round(
            event.nativeEvent.contentOffset.x / (width + s(20)),
          );
          if (idx !== index) {
            setIndex(idx);
          }
        }}>
        {places?.map((place: Place, idx: number) => (
          <View
            style={[
              {
                width: width,
              },
              idx !== places?.length - 1
                ? {
                    marginRight: s(20),
                  }
                : null,
            ]}
            key={idx}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Place', {
                  destination: place,
                  bookmarked: bookmarks.includes(place.id),
                });
              }}>
              <PlaceCard
                place={place}
                bookmarked={bookmarks.includes(place.id)}
                setBookmarked={setBookmarked}
                image={
                  place.photo
                    ? {
                        uri: place.photo,
                      }
                    : icons.defaultIcon
                }
                displayCategory={displayCategory}
                displaySuggester={isGroupPlace}
                voted={voteIndex === idx}
                onVote={() => onVote(idx)}
                mySuggestion={
                  mySuggestions.includes(idx) && places.length !== 1
                }
                onRemoveSuggestion={() => {
                  if (onRemoveSuggestion) {
                    onRemoveSuggestion(place.group_place_id);
                  }
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <ScrollIndicator num={places?.length} idx={index} special={voteIndex} />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: s(10),
    overflow: 'visible', // display shadow
  },
});

export default PlacesDisplay;
