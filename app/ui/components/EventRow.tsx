import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {s} from 'react-native-size-matters';
import moment from 'moment';

import icons from '../../constants/icons';

import Text from './Text';
import IconCluster from './IconCluster';

import {Event} from '../../utils/types';

interface Props {
  event: Event;
  selfUserId: number;
}

const EventRow: React.FC<Props> = ({event, selfUserId}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={event.photo ? {uri: event.photo} : icons.placeholder}
          resizeMode={'cover'}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text size="s" numberOfLines={1}>
          {event.name}
        </Text>
        <Text size="xs" weight="l" numberOfLines={1}>
          {event.vicinity}
        </Text>
        {event.datetime ? (
          <Text size="xs">
            {moment(event.datetime).format('MMM Do, h:mm a')}
          </Text>
        ) : null}
      </View>
      <IconCluster users={event.members} selfUserId={selfUserId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    marginVertical: s(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: s(96),
    height: s(64),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: s(5),
  },
  infoContainer: {
    flex: 1,
    height: s(64),
    paddingLeft: s(10),
    paddingRight: s(5),
    justifyContent: 'space-evenly',
  },
});

export default EventRow;
