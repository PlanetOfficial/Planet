import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {setBookmark} from '../../utils/api/shared/setBookmark';
import {unbookmark} from '../../utils/api/shared/unbookmark';
import EncryptedStorage from 'react-native-encrypted-storage';

import {BlurView} from '@react-native-community/blur';

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
  const [bookmarked, setBookmarked] = useState(marked);

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
      <View style={styles.shadow} />
      <View style={styles.header}>
        <View style={styles.headerBG}>
          {Platform.OS === 'ios' ? (
            <BlurView blurAmount={3} blurType="xlight" style={styles.blur} />
          ) : (
            <View style={[styles.blur, styles.nonBlur]} />
          )}
        </View>
        <View style={styles.texts}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.info}>
            {info}
          </Text>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Image
            style={styles.icon}
            source={bookmarked ? icons.hearted : icons.heart}
          />
        </TouchableOpacity>
      </View>
      <Image style={styles.image} source={image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 8 / 5,
  },
  shadow: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    backgroundColor: colors.white,
    borderRadius: s(10),
    shadowColor: '#000',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: s(45),
    margin: 2,
  },
  headerBG: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: s(10) - 3,
    borderTopRightRadius: s(10) - 3,
    overflow: 'hidden',
  },
  blur: {
    width: '100%',
    height: '100%',
  },
  nonBlur: {
    backgroundColor: colors.white,
    opacity: 0.85,
  },
  texts: {
    width: '85%',
  },
  name: {
    marginLeft: s(7),
    width: '100%',
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginLeft: s(7),
    fontSize: s(11),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    position: 'absolute',
    width: '100%',
    aspectRatio: 8 / 5,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: s(10),
    zIndex: -1,
  },
  icon: {
    right: 0,
    marginRight: s(10),
    width: s(18),
    height: s(18),
    tintColor: colors.accent,
  },
});

export default PlaceCard;
