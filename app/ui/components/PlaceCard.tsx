import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';

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
  name: string;
  info: string;
  marked: boolean;
  image: Object;
  onUnBookmark?: (placeId: number) => void;
}

const PlaceCard: React.FC<Props> = ({
  id,
  name,
  info,
  marked,
  image,
  onUnBookmark,
}) => {
  const [bookmarked, setBookmarked] = useState<boolean>(marked);

  const handleBookmark = async () => {
    const authToken = await EncryptedStorage.getItem('auth_token');
    let responseStatus;

    if (!bookmarked) {
      // switch to bookmarked, so call /bookmark
      responseStatus = await setBookmark(authToken, id);
    } else {
      // switch to not bookmarked, so call /unbookmark
      responseStatus = await unbookmark(authToken, id);

      if (onUnBookmark) {
        onUnBookmark(id);
      }
    }

    if (responseStatus) {
      setBookmarked(!bookmarked);

      // TODO: success
    } else {
      // failed
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.header}>
        <View style={styles.texts}>
          <Text size="m" weight="b">
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
