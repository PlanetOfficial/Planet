import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import EventCard from '../components/EventCard';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';

interface Props {
  data: any[];
  onPress: (item: any) => void;
}

const Events: React.FC<Props> = ({data, onPress}) => {
  return (
    <FlatList
      data={data}
      style={styles.container}
      contentContainerStyle={styles.content}
      initialNumToRender={5}
      keyExtractor={item => item?.id}
      ItemSeparatorComponent={Spacer}
      renderItem={({item}) => {
        return (
          <TouchableOpacity onPress={() => onPress(item)}>
            <EventCard
              name={item?.name}
              info={item?.date}
              image={
                item?.places &&
                item?.places?.length !== 0 &&
                item?.places[0]?.image_url
                  ? {uri: item?.places[0]?.image_url}
                  : icons.defaultIcon
              }
            />
          </TouchableOpacity>
        );
      }}
    />
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    width: s(350),
    paddingHorizontal: s(20),
  },
  content: {
    paddingVertical: s(10),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
});

export default Events;
