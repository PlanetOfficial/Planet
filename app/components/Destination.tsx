import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

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
}

const DestinationCard: React.FC<Props> = ({
  id,
  name,
  rating,
  price,
  image,
  marked,
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
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{rating}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
        <TouchableOpacity onPress={handleBookmark}>
          <Image
            source={bookmarked ? icons.bookmarkActive : icons.bookmarkInactive}
            style={styles.bookmarkActive}
          />
        </TouchableOpacity>
      </View>
      <Image source={image} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 300,
    height: 250,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  ratingContainer: {
    backgroundColor: colors.accent,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginRight: 5,
  },
  rating: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  bookmarkActive: {
    tintColor: colors.accent,
    width: 20,
    height: 30,
  },
});

export default DestinationCard;
