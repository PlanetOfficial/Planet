import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {setBookmark} from '../../utils/api/shared/setBookmark';
import {unbookmark} from '../../utils/api/shared/unbookmark';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Props {
  id: number;
  name: string;
  info: string;
  marked: boolean;
  image: Object;
  onUnBookmark?: (placeId: number) => void;
}

const Place: React.FC<Props> = ({
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
    let response;

    if (!bookmarked) {
      // switch to bookmarked, so call /bookmark
      response = await setBookmark(authToken, id);
    } else {
      // switch to not bookmarked, so call /unbookmark
      response = await unbookmark(authToken, id);

      if (onUnBookmark) {
        onUnBookmark(id);
      }
    }

    if (response === 200) {
      setBookmarked(!bookmarked);

      // TODO: success
    } else {
      // failed
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBG} />
        <View>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text style={styles.info}>{info}</Text>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Image
            style={[
              styles.icon,
              {tintColor: bookmarked ? colors.accent : colors.darkgrey},
            ]}
            source={icons.bookmark}
          />
        </TouchableOpacity>
      </View>
      <Image style={styles.image} source={image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: s(200),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: s(50),
  },
  headerBG: {
    position: 'absolute',
    opacity: 0.85,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: s(15),
    borderTopRightRadius: s(15),
    backgroundColor: colors.white,
  },
  name: {
    marginLeft: s(10),
    width: s(260),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginLeft: s(10),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: s(200),
    borderRadius: s(15),
    zIndex: -1,
  },
  icon: {
    marginRight: s(10),
    width: s(27),
    height: s(27),
  },
});

export default Place;
