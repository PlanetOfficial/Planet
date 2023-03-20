import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

import {colors} from '../constants/colors';


const W = Dimensions.get('window').width;

const Place = (name: string, category: string, image: any) => (
  <View style={cardStyles.container}>
    <Text style={cardStyles.name}>{name}</Text>
    <Text style={cardStyles.category}>{category}</Text>
    <Image style={cardStyles.image} source={image} />
  </View>
);

const cardStyles = StyleSheet.create({
  container: {
    width: W - 60,
    height: 200,
    marginBottom: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  category: {
    marginVertical: 2,
    fontSize: 12,
    color: colors.accent,
  },
  image: {
    width: W - 60,
    height: 164,
    borderRadius: 10,
  },
});

export default Place;