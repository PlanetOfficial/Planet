import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {colors} from '../constants/theme';

interface Props {
  name: string;
  image: Object;
}

const DestinationSimplified: React.FC<Props> = ({name, image}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
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
    width: '95%',
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
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default DestinationSimplified;
