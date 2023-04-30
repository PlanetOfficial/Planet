import React from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {s} from 'react-native-size-matters';
import PlaceCard from '../components/PlaceCard';
import ScrollIndicator from '../components/ScrollIndicator';

import {icons} from '../../constants/images';

interface Props {
  navigation: any;
  data: any[];
  width: number;
  bookmarks: any;
  closeDropdown: () => void;
  index: number;
  setIndex: (index: number) => void;
}

const PlacesDisplay: React.FC<Props> = ({
  navigation,
  data,
  width,
  bookmarks,
  closeDropdown,
  index,
  setIndex,
}) => {
  return (
    <>
      <ScrollView
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
          closeDropdown();
          setIndex(
            Math.round(event.nativeEvent.contentOffset.x / (width + s(20))),
          );
        }}>
        {data.map((dest: any, idx: number) => (
          <View
            style={[
              {
                width: width,
              },
              idx !== data.length - 1 && {
                marginRight: s(20),
              },
            ]}
            key={dest.id}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Place', {
                  destination: dest,
                  category: dest?.category?.name,
                });
              }}>
              <PlaceCard
                id={dest?.id}
                name={dest?.name}
                info={dest?.category?.name}
                marked={bookmarks?.includes(dest?.id)}
                image={
                  dest?.image_url
                    ? {
                        uri: dest?.image_url,
                      }
                    : icons.defaultIcon
                }
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <ScrollIndicator num={data.length} idx={index} />
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
