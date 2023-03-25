import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {s, vs} from 'react-native-size-matters';

import {colors} from '../constants/theme';
import {icons} from '../constants/images';
import {setBookmark} from '../utils/api/shared/setBookmark';
import EncryptedStorage from 'react-native-encrypted-storage';
import {unbookmark} from '../utils/api/shared/unbookmark';

interface Props {
  id: number;
  name: string;
  rating: number;
  price: number;
  image: Object;
  marked: boolean;
  selected: boolean,
}

const DestinationCard: React.FC<Props> = ({
  id,
  name,
  rating,
  price,
  image,
  marked,
  selected,
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
    }

    if (response === 200) {
      setBookmarked(!bookmarked);

      // TODO: success
    } else {
      // failed
    }
  };

  return (
    <View style={[cardStyles.container, {borderColor: selected? colors.accent: colors.white}]}>
      <View style={cardStyles.header}>
        <Text style={cardStyles.name}>{name}</Text>
        <TouchableOpacity onPress={handleBookmark} style={cardStyles.bookmark}>
          <Image
            source={bookmarked ? icons.bookmarkActive : icons.bookmarkInactive}
            style={cardStyles.icon}
          />
        </TouchableOpacity>
      </View>
      <Image source={image} style={cardStyles.image} />
    </View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
    height: s(200),
    marginLeft: s(25),
    width: s(300),
    borderRadius: s(15),
    borderWidth: 2,
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
    height: s(30),
    width: s(300),
  },
  name: {
    marginHorizontal: s(5),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  image: {
    width: s(296),
    height: s(166),
    borderRadius: s(15),
    resizeMode: 'stretch',
    tintColor: colors.black,
  },
  bookmark: {
    position: 'absolute',
    top: s(3),
    right: s(10),
  },
  icon: {
  width: s(24),
    height: s(24),
    tintColor: colors.accent,
  }
});

export default DestinationCard;
