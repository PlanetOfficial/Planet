import React, {useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {s} from 'react-native-size-matters';

import PlaceCard from '../components/PlaceCard';
import ScrollIndicator from '../components/ScrollIndicator';

import {icons} from '../../constants/images';

import {Place} from '../../utils/interfaces/types';

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
  displaySuggester = false,
}) => {
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
                  category: place.category.name,
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
                displaySuggester={displaySuggester}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <ScrollIndicator num={places?.length} idx={index} />
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
