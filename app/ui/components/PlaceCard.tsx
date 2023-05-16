import React from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';

import {s} from 'react-native-size-matters';
import EncryptedStorage from 'react-native-encrypted-storage';

import Text from '../components/Text';
import Icon from './Icon';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import {setBookmark} from '../../utils/api/shared/setBookmark';
import {unbookmark} from '../../utils/api/shared/unbookmark';

interface Props {
  id: number;
  small?: boolean;
  name: string;
  info: string;
  bookmarked: boolean;
  setBookmarked: (bookmarked: boolean, id: number) => void;
  image: Object;
}

// TODO: display more info on the card
const PlaceCard: React.FC<Props> = ({
  id,
  small = false,
  name,
  info,
  bookmarked,
  setBookmarked,
  image,
}) => {
  const handleBookmark = async () => {
    const authToken = await EncryptedStorage.getItem('auth_token');
    if (!authToken) {
      return;
    }

    let responseStatus;

    if (!bookmarked) {
      // switch to bookmarked, so call /bookmark
      responseStatus = await setBookmark(authToken, id);
    } else {
      // switch to not bookmarked, so call /unbookmark
      responseStatus = await unbookmark(authToken, id);
    }

    if (responseStatus) {
      setBookmarked(!bookmarked, id);
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.header}>
        <View style={styles.texts}>
          <Text size={small ? 's' : 'm'} weight="b">
            {name}
          </Text>
          <Text size="xs" weight="l" color={colors.accent}>
            {info}
          </Text>
        </View>
        <Icon
          size="m"
          color={colors.accent}
          icon={bookmarked ? icons.hearted : icons.heart}
          onPress={handleBookmark}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 8 / 5,
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: colors.white,
    backgroundColor: colors.white,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '25%',
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  texts: {
    flex: 1,
    justifyContent: 'space-between',
    height: '75%',
    marginRight: s(10),
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(8),
  },
});

export default PlaceCard;
