import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {setBookmark} from '../../utils/api/shared/setBookmark';
import {unbookmark} from '../../utils/api/shared/unbookmark';
import EncryptedStorage from 'react-native-encrypted-storage';
import LinearGradient from 'react-native-linear-gradient';

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
      <View style={styles.shadow}/>
      <View style={styles.header}>
        <LinearGradient colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']} locations={[0, 0.7, 0.8, 1]} style={styles.headerBG} />
        <View>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text style={styles.info}>{info}</Text>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Image
            style={
              styles.icon
            }
            source={bookmarked? icons.hearted: icons.heart}
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
  shadow: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    backgroundColor: colors.white,
    borderRadius: s(10),
    shadowColor: "#000",
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
    top: 0,
    width: '100%',
    height: '115%',
    borderTopLeftRadius: s(10) - 3,
    borderTopRightRadius: s(10) - 3,
    backgroundColor: colors.white,
  },
  name: {
    marginLeft: s(7),
    width: s(260),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginLeft: s(7),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: s(200),
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: s(10),
    zIndex: -1,
  },
  icon: {
    marginRight: s(10),
    width: s(18),
    height: s(18),
    tintColor: colors.accent,
  },
});

export default Place;
