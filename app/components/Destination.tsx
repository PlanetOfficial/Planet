import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import {colors} from '../constants/theme';

interface Props {
  name: string;
  rating: number;
  price: number;
  image: Object;
}

const DestinationCard: React.FC<Props> = ({name, rating, price, image}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{rating}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
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
});

export default DestinationCard;
