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
  selected: boolean;
}

const Place: React.FC<Props> = ({id, name, info, marked, image, selected}) => {
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
    }

    if (response === 200) {
      setBookmarked(!bookmarked);

      // TODO: success
    } else {
      // failed
    }
  };

  return (
    // TODO: selection UI is obviously temporary
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {backgroundColor: selected ? colors.accent : colors.white},
        ]}>
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
              {tintColor: bookmarked ? colors.accent : colors.grey},
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
    marginHorizontal: s(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(5),
  },
  name: {
    width: s(260),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    width: '100%',
    height: s(150),
    borderBottomLeftRadius: s(15),
    borderBottomRightRadius: s(15),
  },
  icon: {
    width: s(27),
    height: s(27),
  },
});

export default Place;
