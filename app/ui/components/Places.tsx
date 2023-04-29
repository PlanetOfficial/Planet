import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import PlaceCard from '../components/PlaceCard';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';

interface Props {
  data: any[];
  onPress: (item: any) => void;
  onUnBookmark?: (placeId: number) => void;
}

const Places: React.FC<Props> = ({data, onPress, onUnBookmark}) => {
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
            <PlaceCard
              id={item?.id}
              name={item?.name}
              info={item?.category?.name}
              marked={true}
              image={
                item?.image_url
                  ? {
                      uri: item?.image_url,
                    }
                  : icons.defaultIcon
              }
              onUnBookmark={onUnBookmark}
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

export default Places;
